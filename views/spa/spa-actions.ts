/* eslint @typescript-eslint/no-explicit-any: [off] */
import { removeNonce, removeNonceByAmount, setAftWalletBurner, setMintingRow, setNftsUiDetails, setNftsUiMinter, setOtfWalletProcessing, setOtfWalletToggle, setPptsUiDetails, setPptsUiMinter, switchToken } from '../../source/redux/actions';
import { mintingRowBy, nftTotalBy, nonceBy, noncesBy, pptTotalBy } from '../../source/redux/selectors';
import { AppThunk } from '../../source/redux/store';
import { Address, AftWalletBurner, Amount, Level, MAX_UINT256, MinterStatus, Nft, NftCoreId, NftIssue, NftLevel, NftLevels, NftMinterApproval, NftMinterList, NftMinterStatus, NftSenderStatus, OtfWallet, PptBurnerStatus, PptClaimerStatus, PptMinterApproval, PptMinterList, PptMinterStatus, Token } from '../../source/redux/types';

import { Blockchain } from '../../source/blockchain';
import { MoeTreasuryFactory, OnClaim, OnStakeBatch, OnUnstakeBatch, PptTreasuryFactory } from '../../source/contract';
import { Alert, alert, Alerts, ancestor, x40 } from '../../source/functions';
import { HashManager, MiningManager as MM } from '../../source/managers';
import { ROParams } from '../../source/params';
import { globalRef } from '../../source/react';
import { Tokenizer } from '../../source/token';
import { MoeWallet, NftWallet, OnApproval, OnApprovalForAll, OnTransfer, OnTransferBatch, OnTransferSingle, OtfManager, SovWallet } from '../../source/wallet';
import { Years } from '../../source/years';

import { Web3Provider } from '@ethersproject/providers';
import { parseUnits } from '@ethersproject/units';
import { AnyAction } from '@reduxjs/toolkit';
import { Transaction } from 'ethers';
/**
 * mining:
 */
export const miningToggle = AppThunk('mining/toggle', (args: {
    address: Address | null, token: Token
}, api) => {
    const { address, token } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    return MM(api).toggle({ address, token });
});
export const miningSpeed = AppThunk('mining/speed', (args: {
    address: Address | null, token: Token, by: number
}, api) => {
    const { address, token, by } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const miner = MM(api).miner({ address, token });
    if (by > 0) {
        return miner.increase(by * (+1));
    } else {
        return miner.decrease(by * (-1));
    }
});
/**
 * minting:
 */
export const mintingMint = AppThunk('minting/mint', async (args: {
    address: Address | null, token: Token, level: Level
}, api) => {
    const { address, token, level } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const amount = Tokenizer.amount(token, level);
    const block_hash = HashManager.latestHash({
        token: Tokenizer.xify(token), version: ROParams.version
    });
    if (!block_hash) {
        throw new Error('missing block-hash');
    }
    const { nonce } = nonceBy(api.getState(), {
        address, amount, block_hash, token
    });
    if (!nonce) {
        throw new Error(`missing nonce for amount=${amount}`);
    }
    const moe_wallet = new MoeWallet(address, token);
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        const on_transfer: OnTransfer = async (
            from, to, amount, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            moe_wallet.offTransfer(on_transfer);
            if (api.getState().token !== token) {
                return;
            }
            const { tx_counter } = mintingRowBy(
                api.getState(), level
            );
            if (tx_counter > 0) {
                api.dispatch(setMintingRow({
                    level, row: { tx_counter: tx_counter - 1 }
                }));
            }
        };
        set_status(MinterStatus.minting);
        moe_wallet.onTransfer(on_transfer);
        tx = await moe_wallet.mint(
            block_hash, nonce
        );
        console.debug('[mint]', tx);
        const { tx_counter } = mintingRowBy(
            api.getState(), level
        );
        api.dispatch(setMintingRow({
            level, row: { tx_counter: tx_counter + 1 }
        }));
        api.dispatch(removeNonce(nonce, {
            address, block_hash, token
        }));
        set_status(MinterStatus.minted);
    } catch (ex: any) {
        set_status(MinterStatus.error);
        /* eslint no-ex-assign: [off] */
        if (ex.error) {
            ex = ex.error;
        }
        if (ex.message && ex.message.match(
            /internal JSON-RPC error/i
        )) {
            if (ex.data && ex.data.message && ex.data.message.match(
                /gas required exceeds allowance/i
            )) {
                if (OtfManager.enabled) {
                    const miner = MM(api).miner({ address, token });
                    if (miner.running) {
                        miner.pause();
                    }
                }
            }
            if (ex.data && ex.data.message && ex.data.message.match(
                /empty nonce-hash/i
            )) {
                api.dispatch(removeNonce(nonce, {
                    address, block_hash, token
                }));
            }
        }
        const $mint = globalRef<HTMLElement>(
            `.mint[level="${level}"]`
        );
        error(ex, {
            after: $mint.current, id: `${nonce}`
        });
    }
    function set_status(status: MinterStatus) {
        api.dispatch(setMintingRow({ level, row: { status } }));
    }
});
export const mintingForget = AppThunk('minting/forget', (args: {
    address: Address | null, token: Token, level: Level
}, api) => {
    const { address, token, level } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const amount = Tokenizer.amount(
        token, level
    );
    const result = noncesBy(api.getState(), {
        address, amount, token
    });
    for (const { item } of result) {
        api.dispatch(removeNonceByAmount(item));
    }
});
/**
 * nft-sender:
 */
export const nftsTransfer = AppThunk('nfts/transfer', async (args: {
    address: Address | null, token: Token, issue: NftIssue, level: NftLevel
}, api) => {
    const { address, token, issue, level } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const nft_token = Nft.token(
        token
    );
    const core_id = Nft.coreId({
        issue, level
    });
    const { nfts_ui: { details } } = api.getState();
    const by_token = details[nft_token];
    const by_level = by_token[level];
    const by_issue = by_level[issue];
    const target = by_issue.target.value as Address;
    const amount = by_issue.amount.value as Amount;
    const nft_wallet = new NftWallet(
        address, token
    );
    const on_single_tx: OnTransferSingle = async (
        op, from, to, id, value, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        api.dispatch(setNftsUiDetails({
            details: {
                [nft_token]: {
                    [level]: {
                        [issue]: {
                            amount: {
                                valid: null, value: null
                            }
                        }
                    }
                }
            }
        }));
        set_status(NftSenderStatus.sent);
    };
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        set_status(NftSenderStatus.sending);
        nft_wallet.onTransferSingle(on_single_tx);
        tx = await nft_wallet.safeTransfer(
            target, core_id, amount
        );
    } catch (ex: any) {
        /* eslint no-ex-assign: [off] */
        if (ex.error) {
            ex = ex.error;
        }
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            const $ref = globalRef<HTMLElement>(
                `.nft-sender[core-id="${core_id}"]`
            );
            const $sender_row = ancestor(
                $ref.current, (e) => e.classList.contains('row')
            );
            alert(ex.message, Alert.warning, {
                style: { margin: '0.5em 0 -0.5em 0' },
                after: $sender_row
            });
        }
        set_status(NftSenderStatus.error);
        console.error(ex);
    }
    function set_status(status: NftSenderStatus) {
        api.dispatch(setNftsUiDetails({
            details: {
                [nft_token]: {
                    [level]: { [issue]: { sender: { status } } }
                }
            }
        }));
    }
});
/**
 * nft-minter:
 */
export const nftsApprove = AppThunk('nfts/approve', async (args: {
    address: Address | null, token: Token
}, api) => {
    const { address, token } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const moe_wallet = new MoeWallet(address, token);
    const nft_wallet = new NftWallet(address, token);
    const on_approval: OnApproval = (
        owner, spender, value, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        set_approval(NftMinterApproval.approved);
    };
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        set_approval(NftMinterApproval.approving);
        moe_wallet.onApproval(on_approval);
        const nft_contract = await nft_wallet.contract;
        tx = await moe_wallet.approve(
            nft_contract.address, MAX_UINT256
        );
    } catch (ex) {
        set_approval(NftMinterApproval.error);
        const $button = document.querySelector<HTMLElement>(
            '#nft-batch-minting'
        );
        error(ex, { after: $button });
    }
    function set_approval(approval: NftMinterApproval) {
        api.dispatch(setNftsUiMinter({
            minter: { [Nft.token(token)]: { approval } }
        }));
    }
});
export const nftsBatchMint = AppThunk('nfts/batch-mint', async (args: {
    address: Address | null, token: Token, list: NftMinterList
}, api) => {
    const { address, token, list } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const nft_token = Nft.token(
        token
    );
    const nfts = [] as Array<{
        level: NftLevel; amount: Amount;
    }>;
    for (const level of NftLevels()) {
        const { amount } = list[level];
        if (amount)
            nfts.push({ level, amount });
    }
    const levels = nfts.map((nft) => nft.level);
    const amounts = nfts.map((nft) => nft.amount);
    const on_batch_tx: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        set_status(NftMinterStatus.minted);
    };
    const nft_wallet = new NftWallet(address, token);
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        set_status(NftMinterStatus.minting);
        nft_wallet.onTransferBatch(on_batch_tx);
        tx = await nft_wallet.mintBatch(levels, amounts);
    } catch (ex) {
        set_status(NftMinterStatus.error);
        const $button = document.querySelector<HTMLElement>(
            '#nft-batch-minting'
        );
        error(ex, { after: $button });
    }
    function set_status(status: NftMinterStatus) {
        api.dispatch(setNftsUiMinter({
            minter: { [nft_token]: { status } }
        }));
    }
});
/**
 * ppt-claimer:
 */
export const pptsClaimRewards = AppThunk('ppts/claim-rewards', async (args: {
    address: Address | null, token: Token, issue: NftIssue, level: NftLevel
}, api) => {
    const { address, token, issue, level } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const core_id = Nft.coreId({
        issue, level
    });
    const moe_treasury = MoeTreasuryFactory({
        token
    });
    const on_claim_tx: OnClaim = async (
        acc, id, amount, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        set_status(PptClaimerStatus.claimed);
    };
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        set_status(PptClaimerStatus.claiming);
        moe_treasury.then(
            (c) => c.on('Claim', on_claim_tx)
        );
        const contract = await OtfManager.connect(
            await moe_treasury
        );
        tx = await contract.claimFor(
            x40(address), core_id
        );
    } catch (ex: any) {
        set_status(PptClaimerStatus.error);
        const $ref = globalRef<HTMLElement>(
            `.ppt-claimer[core-id="${core_id}"]`
        );
        const $claimer_row = ancestor(
            $ref.current, (e) => e.classList.contains('row')
        );
        error(ex, {
            after: $claimer_row,
            style: { margin: '0.5em 0 -0.5em 0' }
        });
    }
    function set_status(status: PptClaimerStatus) {
        if (status === PptClaimerStatus.claimed) {
            const state = api.getState();
            if (!Tokenizer.aified(state.token)) {
                api.dispatch(switchToken(Tokenizer.aify(state.token)));
            }
        }
        api.dispatch(setPptsUiDetails({
            details: {
                [Nft.token(token)]: {
                    [level]: { [issue]: { claimer: { status } } }
                }
            }
        }));
    }
});
/**
 * ppt-minter:
 */
export const pptsApprove = AppThunk('ppts/approve', async (args: {
    address: Address | null, token: Token
}, api) => {
    const { address, token } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const ppt_token = Nft.token(
        token
    );
    const ppt_treasury = PptTreasuryFactory({
        token
    });
    const nft_wallet = new NftWallet(address, token);
    const approved = await nft_wallet.isApprovedForAll(
        address
    );
    if (approved) {
        const minter = {
            [ppt_token]: {
                approval: PptMinterApproval.approved
            }
        };
        api.dispatch(setPptsUiMinter({ minter }));
    } else {
        const on_approval: OnApprovalForAll = (
            account, op, flag, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            set_approval(PptMinterApproval.approved);
        };
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            set_approval(PptMinterApproval.approving);
            nft_wallet.onApprovalForAll(on_approval);
            tx = await nft_wallet.setApprovalForAll(
                await ppt_treasury.then((c) => c.address), true
            );
        } catch (ex) {
            set_approval(PptMinterApproval.error);
            const $button = document.querySelector<HTMLElement>(
                '#ppt-batch-minting'
            );
            error(ex, { after: $button });
        }
    }
    function set_approval(approval: PptMinterApproval) {
        api.dispatch(setPptsUiMinter({
            minter: { [ppt_token]: { approval } }
        }));
    }
});
export const pptsBatchMint = AppThunk('ppts/batch-mint', async (args: {
    address: Address | null, token: Token, list: PptMinterList
}, api) => {
    const { address, token, list } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const ppt_token = Nft.token(
        token
    );
    const ppt_mints = [] as Array<{
        ppt_id: NftCoreId; amount: Amount;
    }>;
    for (const level of NftLevels()) {
        const { amount } = list[level];
        if (amount > 0n) {
            // stake from youngest to oldest (backwards):
            const issues = Array.from(Years()).reverse();
            let mint_amount = amount;
            for (const issue of issues) {
                const nft_total = nftTotalBy(api.getState(), {
                    level, issue
                });
                if (nft_total.amount === 0n) {
                    continue;
                }
                const ppt_id = Nft.coreId({
                    level, issue
                });
                if (mint_amount >= nft_total.amount) {
                    ppt_mints.push({
                        ppt_id, amount: nft_total.amount
                    });
                    mint_amount -= nft_total.amount;
                } else {
                    ppt_mints.push({
                        ppt_id, amount: mint_amount
                    });
                    mint_amount = 0n;
                }
                if (mint_amount === 0n) {
                    break;
                }
            }
        }
    }
    const ppt_ids = ppt_mints.map((mint) => mint.ppt_id);
    const amounts = ppt_mints.map((mint) => mint.amount);
    const on_stake_batch: OnStakeBatch = async (
        from, nftIds, amounts, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        set_status(PptMinterStatus.minted);
    };
    const ppt_treasury = PptTreasuryFactory({
        token
    });
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        set_status(PptMinterStatus.minting);
        ppt_treasury.then(
            (c) => c?.on('StakeBatch', on_stake_batch)
        );
        const contract = await OtfManager.connect(
            await ppt_treasury
        );
        tx = await contract.stakeBatch(
            x40(address), ppt_ids, amounts
        );
    } catch (ex: any) {
        set_status(PptMinterStatus.error);
        const $button = document.querySelector<HTMLElement>(
            '#ppt-batch-minting'
        );
        error(ex, { after: $button });
    }
    function set_status(minter_status: PptMinterStatus) {
        api.dispatch(setPptsUiMinter({
            minter: { [ppt_token]: { minter_status } }
        }));
    }
});
export const pptsBatchBurn = AppThunk('ppts/batch-burn', async (args: {
    address: Address | null, token: Token, list: PptMinterList
}, api) => {
    const { address, token, list } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const ppt_token = Nft.token(
        token
    );
    const ppt_burns = [] as Array<{
        ppt_id: NftCoreId; amount: Amount;
    }>;
    for (const level of NftLevels()) {
        const { amount } = list[level];
        if (amount < 0n) {
            // unstake from oldest to youngest:
            const issues = Array.from(Years());
            let burn_amount = -amount;
            for (const issue of issues) {
                const ppt_total = pptTotalBy(api.getState(), {
                    level, issue
                });
                if (ppt_total.amount === 0n) {
                    continue;
                }
                const ppt_id = Nft.coreId({
                    level, issue
                });
                if (burn_amount >= ppt_total.amount) {
                    ppt_burns.push({
                        ppt_id, amount: ppt_total.amount
                    });
                    burn_amount -= ppt_total.amount;
                } else {
                    ppt_burns.push({
                        ppt_id, amount: burn_amount
                    });
                    burn_amount = 0n;
                }
                if (burn_amount === 0n) {
                    break;
                }
            }
        }
    }
    const ppt_ids = ppt_burns.map((burn) => burn.ppt_id);
    const amounts = ppt_burns.map((burn) => burn.amount);
    const on_unstake_batch: OnUnstakeBatch = async (
        from, nftIds, amounts, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        set_status(PptBurnerStatus.burned);
    };
    const ppt_treasury = PptTreasuryFactory({
        token
    });
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        set_status(PptBurnerStatus.burning);
        ppt_treasury.then(
            (c) => c?.on('UnstakeBatch', on_unstake_batch)
        );
        const contract = await OtfManager.connect(
            await ppt_treasury
        );
        tx = await contract.unstakeBatch(
            x40(address), ppt_ids, amounts
        );
    } catch (ex: any) {
        set_status(PptBurnerStatus.error);
        const $button = document.querySelector<HTMLElement>(
            '#ppt-batch-minting'
        );
        error(ex, { after: $button });
    }
    function set_status(burner_status: PptBurnerStatus) {
        api.dispatch(setPptsUiMinter({
            minter: { [ppt_token]: { burner_status } }
        }));
    }
});
/**
 * aft-wallet:
 */
 export const aftBurn = AppThunk('aft/burn', async (args: {
    address: Address | null, token: Token, amount: Amount
}, api) => {
    const action = Tokenizer.aified(args.token)
        ? aftBurnAPower(args) : aftBurnXPower(args);
    api.dispatch(action as unknown as AnyAction);
});
export const aftBurnAPower = AppThunk('aft/burn-apower', async (args: {
    address: Address | null, token: Token, amount: Amount
}, api) => {
    const { address, token, amount } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    if (!Tokenizer.aified(token)) {
        throw new Error('APower token required');
    }
    const sov_wallet = new SovWallet(address, token);
    const on_transfer_tx: OnTransfer = async (
        from, to, amount, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        set_status(AftWalletBurner.burned);
    };
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        set_status(AftWalletBurner.burning);
        sov_wallet.onTransfer(on_transfer_tx);
        tx = await sov_wallet.burn(amount);
    } catch (ex: any) {
        set_status(AftWalletBurner.error);
        console.error(ex);
    }
    function set_status(burner_status: AftWalletBurner) {
        api.dispatch(setAftWalletBurner({ burner: burner_status }));
    }
});
export const aftBurnXPower = AppThunk('aft/burn-xpower', async (args: {
    address: Address | null, token: Token, amount: Amount
}, api) => {
    const { address, token, amount } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    if (!Tokenizer.xified(token)) {
        throw new Error('XPower token required');
    }
    const moe_wallet = new MoeWallet(address, token);
    const on_transfer_tx: OnTransfer = async (
        from, to, amount, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        set_status(AftWalletBurner.burned);
    };
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        set_status(AftWalletBurner.burning);
        moe_wallet.onTransfer(on_transfer_tx);
        tx = await moe_wallet.burn(amount);
    } catch (ex: any) {
        set_status(AftWalletBurner.error);
        console.error(ex);
    }
    function set_status(burner_status: AftWalletBurner) {
        api.dispatch(setAftWalletBurner({ burner: burner_status }));
    }
});
/**
 * otf-wallet:
 */
export const otfToggle = AppThunk('otf-wallet/toggle', (args: {
    toggled: OtfWallet['toggled']
}, api) => {
    api.dispatch(setOtfWalletToggle(args));
});
export const otfDeposit = AppThunk('otf-wallet/deposit', async (args: {
    address: OtfWallet['address'], processing: OtfWallet['processing']
}, api) => {
    const { address, processing } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    if (processing) {
        return;
    }
    api.dispatch(setOtfWalletProcessing({
        processing: true
    }));
    const unit = parseUnits('1.0');
    const provider = new Web3Provider(await Blockchain.provider);
    const mmw_signer = provider.getSigner(x40(address));
    const mmw_balance = await mmw_signer.getBalance();
    let gas_limit = parseUnits('0');
    Alerts.hide();
    try {
        gas_limit = await mmw_signer.estimateGas({
            value: mmw_balance.lt(unit) ? mmw_balance : unit,
            to: x40(address),
        });
    } catch (ex) {
        api.dispatch(setOtfWalletProcessing({
            processing: false
        }));
        console.error(ex);
        return;
    }
    const gas_price_base = await mmw_signer.getGasPrice();
    const gas_price = gas_price_base.add(parseUnits('1.5', 'gwei'));
    const fee = gas_limit.mul(gas_price);
    const value = mmw_balance.lt(unit.add(fee))
        ? mmw_balance.sub(fee) : unit;
    const otf_wallet = await OtfManager.init();
    const otf_address = await otf_wallet.getAddress();
    try {
        const tx = await mmw_signer.sendTransaction({
            gasLimit: gas_limit, gasPrice: gas_price,
            to: otf_address, value
        });
        tx.wait(1).then(() => {
            api.dispatch(setOtfWalletProcessing({
                processing: false
            }));
        });
    } catch (ex) {
        api.dispatch(setOtfWalletProcessing({
            processing: false
        }));
        console.error(ex);
    }
});
export const otfWithdraw = AppThunk('otf-wallet/withdraw', async (args: {
    address: OtfWallet['address'], processing: OtfWallet['processing']
}, api) => {
    const { address, processing } = args;
    if (!address) {
        throw new Error('missing selected-address');
    }
    if (processing) {
        return;
    }
    api.dispatch(setOtfWalletProcessing({
        processing: true
    }));
    const otf_signer = await OtfManager.init();
    const otf_balance = await otf_signer.getBalance();
    let gas_limit = parseUnits('0');
    Alerts.hide();
    try {
        gas_limit = await otf_signer.estimateGas({
            to: x40(address), value: otf_balance
        });
    } catch (ex) {
        api.dispatch(setOtfWalletProcessing({
            processing: false
        }));
        console.error(ex);
        return;
    }
    const gas_price_base = await otf_signer.getGasPrice();
    const gas_price = gas_price_base.mul(1125).div(1000);
    const fee = gas_limit.mul(gas_price);
    const value = otf_balance.sub(fee);
    try {
        const tx = await otf_signer.sendTransaction({
            gasLimit: gas_limit, gasPrice: gas_price,
            to: x40(address), value
        });
        tx.wait(1).then(() => {
            api.dispatch(setOtfWalletProcessing({
                processing: false
            }));
        });
    } catch (ex) {
        api.dispatch(setOtfWalletProcessing({
            processing: false
        }));
        console.error(ex);
    }
});
/**
 * error-alert:
 */
function error(ex: any, options?: {
    style?: Record<string, string>;
    icon?: string; id?: string;
    after?: HTMLElement | null;
}) {
    /* eslint no-ex-assign: [off] */
    if (ex.error) {
        ex = ex.error;
    }
    if (ex.message) {
        if (ex.data && ex.data.message) {
            ex.message = `${ex.message} [${ex.data.message}]`;
        }
        alert(ex.message, Alert.warning, {
            style: { margin: '-0.5em 0 0.5em 0' },
            ...options
        });
    }
    console.error(ex);
}
