/* eslint @typescript-eslint/no-explicit-any: [off] */
import { removeNonce, removeNonceByAmount, setAftWalletBurner, setMintingRow, setNftsUiDetails, setNftsUiMinter, setOtfWalletProcessing, setOtfWalletToggle, setPptsUiDetails, setPptsUiMinter, setRatesUiRefresher, switchToken } from '../../source/redux/actions';
import { mintingRowBy, mintingRowsBy, nftTotalBy, nftsBy, nonceBy, noncesBy, pptTotalBy } from '../../source/redux/selectors';
import { AppThunk } from '../../source/redux/store';
import { Account, AftWalletBurner, Amount, Level, MAX_UINT256, MinterStatus, Nft, NftBurnerStatus, NftFullId, NftIssue, NftLevel, NftLevels, NftMinterApproval, NftMinterList, NftMinterStatus, NftSenderStatus, NftUpgraderStatus, OtfWallet, PptBurnerStatus, PptClaimerStatus, PptMinterApproval, PptMinterList, PptMinterStatus, RefresherStatus, Token, TokenInfo } from '../../source/redux/types';

import { MMProvider } from '../../source/blockchain';
import { MoeTreasuryFactory, OnClaim, OnClaimBatch, OnRefresh, OnStakeBatch, OnUnstakeBatch, PptTreasuryFactory } from '../../source/contract';
import { error, inIframe, x40 } from '../../source/functions';
import { HashManager, MiningManager as MM } from '../../source/managers';
import { ROParams, RWParams } from '../../source/params';
import { Tokenizer } from '../../source/token';
import { MoeWallet, NftWallet, OnApproval, OnApprovalForAll, OnTransfer, OnTransferBatch, OnTransferSingle, OtfManager, SovWallet } from '../../source/wallet';
import { Years } from '../../source/years';

import { AnyAction } from '@reduxjs/toolkit';
import { Transaction, parseUnits } from 'ethers';
/**
 * mining:
 */
export const miningToggle = AppThunk('mining/toggle', (args: {
    account: Account | null
}, api) => {
    const { account } = args;
    if (!account) {
        throw new Error('missing account');
    }
    return MM(api).toggle({ account });
});
export const miningSpeed = AppThunk('mining/speed', (args: {
    account: Account | null, by: number
}, api) => {
    const { account, by } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const miner = MM(api).miner({ account });
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
    account: Account | null, level: Level
}, api) => {
    const { account, level } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const amount = Tokenizer.amount(level);
    const block_hash = HashManager.latestHash({
        version: ROParams.version
    });
    if (!block_hash) {
        throw new Error('missing block-hash');
    }
    const { nonce } = nonceBy(api.getState(), {
        account, amount, block_hash
    });
    if (!nonce) {
        const result = noncesBy(api.getState(), {
            account, amount
        });
        for (const { nonce: n, item: i } of result.filter(({
            item: i
        }) => {
            return i.block_hash !== block_hash
        })) {
            api.dispatch(removeNonce(n, i));
        }
        throw new Error(`missing nonce for amount=${amount}`);
    }
    const moe_wallet = new MoeWallet(account);
    let tx: Transaction | undefined;
    try {
        const on_transfer: OnTransfer = async (
            from, to, amount, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
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
                    const miner = MM(api).miner({ account });
                    if (miner.running) {
                        miner.pause();
                    }
                }
            }
        }
        throw error(ex);
    } finally {
        api.dispatch(removeNonce(nonce, {
            account, block_hash
        }));
    }
    function set_status(status: MinterStatus) {
        if (!inIframe()) api.dispatch(setMintingRow({
            level, row: { status }
        }));
    }
});
export const mintingForget = AppThunk('minting/forget', (args: {
    account: Account | null, level: Level
}, api) => {
    const { account, level } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const amount = Tokenizer.amount(
        level
    );
    const result = noncesBy(api.getState(), {
        account, amount
    });
    for (const { item } of result) {
        api.dispatch(removeNonceByAmount(item));
    }
});
export const mintingIgnore = AppThunk('minting/ignore', (args: {
    level: Level, flag: boolean
}, api) => {
    const { level, flag } = args;
    api.dispatch(setMintingRow({
        level, row: { ignored: flag }
    }));
    const rows = () => mintingRowsBy(api.getState(), {
        display: true
    });
    if (flag && level < ROParams.level.max) {
        // show and consider next level
        api.dispatch(setMintingRow({
            level: level + 1, row: { display: true, ignored: false }
        }));
        // show but ignore smaller levels
        rows().filter(([l]) => l < level).forEach(([l]) => {
            api.dispatch(setMintingRow({
                level: l, row: { display: true, ignored: true }
            }));
        });
    } else {
        // hide but consider greater levels
        rows().filter(([l]) => l > level).forEach(([l]) => {
            api.dispatch(setMintingRow({
                level: l, row: { display: false, ignored: false }
            }));
        });
    }
    // sync with location URL (directly)
    if (flag) {
        RWParams.level = { mint: level + 1 };
    } else {
        RWParams.level = { mint: level };
    }
});
/**
 * nft-sender:
 */
export const nftsTransfer = AppThunk('nfts/transfer', async (args: {
    account: Account | null, issue: NftIssue, level: NftLevel
}, api) => {
    const { account, issue, level } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const full_id = Nft.fullId({
        issue, level
    });
    const { nfts_ui: { details } } = api.getState();
    const by_level = details[level];
    const by_issue = by_level[issue];
    const target = by_issue.target.value as Account;
    const amount = by_issue.amount.value as Amount;
    const nft_wallet = new NftWallet(
        account
    );
    const on_single_tx: OnTransferSingle = async (
        op, from, to, id, value, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        api.dispatch(setNftsUiDetails({
            details: {
                [level]: {
                    [issue]: {
                        amount: {
                            valid: null, value: null
                        }
                    }
                }
            }
        }));
        set_status(NftSenderStatus.sent);
    };
    let tx: Transaction | undefined;
    try {
        set_status(NftSenderStatus.sending);
        nft_wallet.onTransferSingle(on_single_tx);
        tx = await nft_wallet.safeTransfer(
            target, full_id, amount
        );
    } catch (ex: any) {
        set_status(NftSenderStatus.error);
        throw error(ex);
    }
    function set_status(status: NftSenderStatus) {
        if (!inIframe()) api.dispatch(setNftsUiDetails({
            details: { [level]: { [issue]: { sender: { status } } } }
        }));
    }
});
/**
 * nft-minter:
 */
export const nftsApprove = AppThunk('nfts/approve', async (args: {
    account: Account | null
}, api) => {
    const { account } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const moe_wallet = new MoeWallet(account);
    const nft_wallet = new NftWallet(account);
    const on_approval: OnApproval = (
        owner, spender, value, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        set_approval(NftMinterApproval.approved);
    };
    let tx: Transaction | undefined;
    try {
        set_approval(NftMinterApproval.approving);
        moe_wallet.onApproval(on_approval);
        const nft_address = await nft_wallet.address;
        tx = await moe_wallet.approve(nft_address, MAX_UINT256);
    } catch (ex) {
        set_approval(NftMinterApproval.error);
        throw error(ex);
    }
    function set_approval(approval: NftMinterApproval) {
        if (!inIframe()) api.dispatch(setNftsUiMinter({
            minter: { approval }
        }));
    }
});
export const nftsBatchMint = AppThunk('nfts/batch-mint', async (args: {
    account: Account | null, list: NftMinterList
}, api) => {
    const { account, list } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const nfts = [] as Array<{
        level: NftLevel; amount: Amount;
    }>;
    for (const level of NftLevels()) {
        const { amount1 } = list[level];
        if (amount1) {
            nfts.push({ level, amount: amount1 });
        }
    }
    const levels = nfts.map((nft) => nft.level);
    const amounts = nfts.map((nft) => nft.amount);
    const on_mint_batch: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        set_status(NftMinterStatus.minted);
    };
    const nft_wallet = new NftWallet(account);
    let tx: Transaction | undefined;
    try {
        set_status(NftMinterStatus.minting);
        nft_wallet.onTransferBatch(on_mint_batch);
        tx = await nft_wallet.mintBatch(levels, amounts);
    } catch (ex) {
        set_status(NftMinterStatus.error);
        throw error(ex);
    }
    function set_status(minter_status: NftMinterStatus) {
        if (!inIframe()) api.dispatch(setNftsUiMinter({
            minter: { minter_status }
        }));
    }
});
export const nftsBatchBurn = AppThunk('nfts/batch-burn', async (args: {
    account: Account | null, list: NftMinterList
}, api) => {
    const { account, list } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const nft_burns = [] as Array<{
        nft_id: NftFullId; amount: Amount;
    }>;
    for (const level of NftLevels()) {
        const { amount1: amount } = list[level];
        if (amount < 0n) {
            // burn from youngest to oldest (backwards):
            const issues = Array.from(Years()).reverse();
            let burn_amount = -amount;
            for (const issue of issues) {
                const nft_total = nftTotalBy(api.getState(), {
                    level, issue
                });
                if (nft_total.amount === 0n) {
                    continue; // filter empty
                }
                if (issue + 2 ** (level / 3) - 1 > issues[0]) {
                    continue; // irredeemable
                }
                const nft_id = Nft.fullId({
                    level, issue
                });
                if (burn_amount >= nft_total.amount) {
                    nft_burns.push({
                        nft_id, amount: nft_total.amount
                    });
                    burn_amount -= nft_total.amount;
                } else {
                    nft_burns.push({
                        nft_id, amount: burn_amount
                    });
                    burn_amount = 0n;
                }
                if (burn_amount === 0n) {
                    break;
                }
            }
        }
    }
    const nft_ids = nft_burns.map((burn) => burn.nft_id);
    const amounts = nft_burns.map((burn) => burn.amount);
    const on_burn_batch: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        set_status(NftBurnerStatus.burned);
    };
    const nft_wallet = new NftWallet(account);
    let tx: Transaction | undefined;
    try {
        set_status(NftBurnerStatus.burning);
        nft_wallet.onTransferBatch(on_burn_batch);
        tx = await nft_wallet.burnBatch(
            nft_ids, amounts
        );
    } catch (ex: any) {
        set_status(NftBurnerStatus.error);
        throw error(ex);
    }
    function set_status(burner_status: NftBurnerStatus) {
        if (!inIframe()) api.dispatch(setNftsUiMinter({
            minter: { burner_status }
        }));
    }
});
export const nftsBatchUpgrade = AppThunk('nfts/batch-upgrade', async (args: {
    account: Account | null, list: NftMinterList
}, api) => {
    const { account, list } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const nfts = [] as Array<{
        issue: NftIssue, level: NftLevel; amount: Amount;
    }>;
    for (const nft_level of NftLevels()) {
        const { amount2 } = list[nft_level];
        if (amount2 && nft_level >= 3) {
            for (const nft_issue of Years()) {
                const { items } = nftsBy(api.getState(), {
                    level: nft_level - 3,
                    issue: nft_issue,
                });
                const sub_total = Object.values(items).reduce(
                    (acc, { amount }) => acc + amount / 1000n, 0n
                );
                if (sub_total > 0) nfts.push({
                    issue: nft_issue,
                    level: nft_level,
                    amount: sub_total
                });
            }
        }
    }
    const issues = Array.from(new Set(nfts.map(({ issue }) => issue)));
    const levels = [] as Array<NftLevel[]>;
    const amounts = [] as Array<Amount[]>;
    for (const issue of issues) {
        levels.push(nfts
            .filter((nft) => nft.issue === issue)
            .map((nft) => nft.level));
        amounts.push(nfts
            .filter((nft) => nft.issue === issue)
            .map((nft) => nft.amount));
    }
    const on_batch_tx: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        set_status(NftUpgraderStatus.upgraded);
    };
    const nft_wallet = new NftWallet(account);
    let tx: Transaction | undefined;
    try {
        set_status(NftUpgraderStatus.upgrading);
        nft_wallet.onTransferBatch(on_batch_tx);
        tx = await nft_wallet.upgradeBatch(issues, levels, amounts);
    } catch (ex) {
        set_status(NftUpgraderStatus.error);
        throw error(ex);
    }
    function set_status(upgrader_status: NftUpgraderStatus) {
        if (!inIframe()) api.dispatch(setNftsUiMinter({
            minter: { upgrader_status }
        }));
    }
});
/**
 * ppt-minter:
 */
export const pptsApprove = AppThunk('ppts/approve', async (args: {
    account: Account | null
}, api) => {
    const { account } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const ppt_treasury = PptTreasuryFactory();
    const nft_wallet = new NftWallet(account);
    const approved = await nft_wallet.isApprovedForAll(
        account
    );
    if (approved) {
        const minter = {
            approval: PptMinterApproval.approved
        };
        api.dispatch(setPptsUiMinter({ minter }));
    } else {
        const on_approval: OnApprovalForAll = (
            account, op, flag, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            set_approval(PptMinterApproval.approved);
        };
        let tx: Transaction | undefined;
        try {
            set_approval(PptMinterApproval.approving);
            nft_wallet.onApprovalForAll(on_approval);
            tx = await nft_wallet.setApprovalForAll(
                ppt_treasury.address, true
            );
        } catch (ex) {
            set_approval(PptMinterApproval.error);
            throw error(ex);
        }
    }
    function set_approval(approval: PptMinterApproval) {
        if (!inIframe()) api.dispatch(setPptsUiMinter({
            minter: { approval }
        }));
    }
});
export const pptsBatchMint = AppThunk('ppts/batch-mint', async (args: {
    account: Account | null, list: PptMinterList
}, api) => {
    const { account, list } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const ppt_mints = [] as Array<{
        ppt_id: NftFullId; amount: Amount;
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
                const ppt_id = Nft.fullId({
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
        account, nft_ids, amounts, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        set_status(PptMinterStatus.minted);
    };
    const ppt_treasury = PptTreasuryFactory();
    let tx: Transaction | undefined;
    try {
        set_status(PptMinterStatus.minting);
        ppt_treasury.onStakeBatch(on_stake_batch);
        tx = await ppt_treasury.stakeBatch(
            account, ppt_ids, amounts
        );
    } catch (ex: any) {
        set_status(PptMinterStatus.error);
        throw error(ex);
    }
    function set_status(minter_status: PptMinterStatus) {
        if (!inIframe()) api.dispatch(setPptsUiMinter({
            minter: { minter_status }
        }));
    }
});
export const pptsBatchBurn = AppThunk('ppts/batch-burn', async (args: {
    account: Account | null, list: PptMinterList
}, api) => {
    const { account, list } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const ppt_burns = [] as Array<{
        ppt_id: NftFullId; amount: Amount;
    }>;
    for (const level of NftLevels()) {
        const { amount } = list[level];
        if (amount < 0n) {
            // unstake from youngest to oldest (backwards):
            const issues = Array.from(Years()).reverse();
            let burn_amount = -amount;
            for (const issue of issues) {
                const ppt_total = pptTotalBy(api.getState(), {
                    level, issue
                });
                if (ppt_total.amount === 0n) {
                    continue;
                }
                const ppt_id = Nft.fullId({
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
        account, nft_ids, amounts, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        set_status(PptBurnerStatus.burned);
    };
    const ppt_treasury = PptTreasuryFactory();
    let tx: Transaction | undefined;
    try {
        set_status(PptBurnerStatus.burning);
        ppt_treasury.onUnstakeBatch(on_unstake_batch);
        tx = await ppt_treasury.unstakeBatch(
            account, ppt_ids, amounts
        );
    } catch (ex: any) {
        set_status(PptBurnerStatus.error);
        throw error(ex);
    }
    function set_status(burner_status: PptBurnerStatus) {
        if (!inIframe()) api.dispatch(setPptsUiMinter({
            minter: { burner_status }
        }));
    }
});
/**
 * ppt-claimer:
 */
export const pptsClaim = AppThunk('ppts/claim', async (args: {
    account: Account | null, issue: NftIssue, level: NftLevel
}, api) => {
    const { account, issue, level } = args;
    if (!account) {
        throw new Error('missing account');
    }
    const ppt_id = Nft.fullId({
        issue, level
    });
    const moe_treasury = MoeTreasuryFactory();
    const on_claim_tx: OnClaim = (
        account, nft_id, amount, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        set_status(PptClaimerStatus.claimed);
    };
    const token = RWParams.token;
    if (!Tokenizer.aified(token)) {
        api.dispatch(switchToken(Tokenizer.aify(token)));
    }
    let tx: Transaction | undefined;
    try {
        set_status(PptClaimerStatus.claiming);
        moe_treasury.onClaim(on_claim_tx);
        tx = await moe_treasury.claim(
            account, ppt_id
        );
    } catch (ex: any) {
        set_status(PptClaimerStatus.error);
        throw error(ex);
    }
    function set_status(status: PptClaimerStatus) {
        if (!inIframe()) api.dispatch(setPptsUiDetails({
            details: { [level]: { [issue]: { claimer: { status } } } }
        }));
    }
});
export const pptsBatchClaim = AppThunk('ppts/batch-claim', async (args: {
    account: Account | null
}, api) => {
    const { account } = args;
    if (!account) {
        throw new Error('missing account');
    }
    set_status(PptClaimerStatus.claiming);
    const ppt_ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const moe_treasury = MoeTreasuryFactory();
    const mintables = await moe_treasury
        .mintableBatch(account, ppt_ids);
    const mintable = mintables
        .reduce((acc, c) => acc + floor(c), 0n);
    if (mintable === 0n) {
        set_status(PptClaimerStatus.error);
        throw error(`Insufficient mintables yet; need to wait.`);
    }
    const on_claim_batch: OnClaimBatch = (
        account, nft_ids, amounts, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        set_status(PptClaimerStatus.claimed);
    };
    const token = RWParams.token;
    if (!Tokenizer.aified(token)) {
        api.dispatch(switchToken(Tokenizer.aify(token)));
    }
    let tx: Transaction | undefined;
    try {
        moe_treasury.onClaimBatch(on_claim_batch);
        tx = await moe_treasury.claimBatch(
            account, ppt_ids.filter((_, i) => floor(mintables[i]))
        );
    } catch (ex: any) {
        set_status(PptClaimerStatus.error);
        throw error(ex);
    }
    function set_status(claimer_status: PptClaimerStatus) {
        if (!inIframe()) api.dispatch(setPptsUiMinter({
            minter: { claimer_status }
        }));
    }
    function floor(amount: Amount) {
        const { decimals } = TokenInfo(Token.APOW);
        const lower = parseUnits('1.000', decimals);
        return lower <= amount ? amount : 0n;
    }
});
/**
 * rates-refresher:
 */
export const ratesRefresh = AppThunk('rates/refresh', async (args: {
    all_levels: boolean
}, api) => {
    const { all_levels } = args;
    const moe_treasury = MoeTreasuryFactory();
    const on_refresh_tx: OnRefresh = (
        all_levels: boolean, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        set_status(RefresherStatus.refreshed);
    };
    try {
        set_status(RefresherStatus.refreshing);
        const flag = await moe_treasury.refreshable();
        if (!flag) {
            set_status(RefresherStatus.refetch);
            return;
        }
    } catch (ex: any) {
        set_status(RefresherStatus.error);
        throw error(ex);
    }
    let tx: Transaction | undefined;
    try {
        set_status(RefresherStatus.refreshing);
        moe_treasury.onRefreshRates(on_refresh_tx);
        tx = await moe_treasury.refreshRates(
            all_levels
        );
    } catch (ex: any) {
        set_status(RefresherStatus.error);
        throw error(ex);
    }
    function set_status(status: RefresherStatus) {
        if (!inIframe()) api.dispatch(setRatesUiRefresher({
            refresher: { status }
        }));
    }
});
/**
 * aft-wallet:
 */
export const aftBurn = AppThunk('aft/burn', async (args: {
    account: Account | null, amount: Amount, token: Token
}, api) => {
    const action = Tokenizer.aified(args.token)
        ? aftBurnAPower(args) : aftBurnXPower(args);
    api.dispatch(action as unknown as AnyAction);
});
export const aftBurnAPower = AppThunk('aft/burn-apower', async (args: {
    account: Account | null, amount: Amount, token: Token
}, api) => {
    const { account, amount, token } = args;
    if (!account) {
        throw new Error('missing account');
    }
    if (!Tokenizer.aified(token)) {
        throw new Error('APower token required');
    }
    const sov_wallet = new SovWallet(account);
    const on_transfer_tx: OnTransfer = async (
        from, to, amount, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        set_status(AftWalletBurner.burned);
    };
    let tx: Transaction | undefined;
    try {
        set_status(AftWalletBurner.burning);
        sov_wallet.onTransfer(on_transfer_tx);
        tx = await sov_wallet.burn(amount);
    } catch (ex: any) {
        set_status(AftWalletBurner.error);
        throw error(ex);
    }
    function set_status(burner_status: AftWalletBurner) {
        if (!inIframe()) api.dispatch(setAftWalletBurner({
            burner: burner_status
        }));
    }
});
export const aftBurnXPower = AppThunk('aft/burn-xpower', async (args: {
    account: Account | null, amount: Amount, token: Token
}, api) => {
    const { account, amount, token } = args;
    if (!account) {
        throw new Error('missing account');
    }
    if (!Tokenizer.xified(token)) {
        throw new Error('XPower token required');
    }
    const moe_wallet = new MoeWallet(account);
    const on_transfer_tx: OnTransfer = async (
        from, to, amount, ev
    ) => {
        if (ev.log.transactionHash !== tx?.hash) {
            return;
        }
        set_status(AftWalletBurner.burned);
    };
    let tx: Transaction | undefined;
    try {
        set_status(AftWalletBurner.burning);
        moe_wallet.onTransfer(on_transfer_tx);
        tx = await moe_wallet.burn(amount);
    } catch (ex: any) {
        set_status(AftWalletBurner.error);
        throw error(ex);
    }
    function set_status(burner_status: AftWalletBurner) {
        if (!inIframe()) api.dispatch(setAftWalletBurner({
            burner: burner_status
        }));
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
    account: OtfWallet['account'], processing: OtfWallet['processing'],
    amount: OtfWallet['amount']
}, api) => {
    const provider = await MMProvider();
    if (provider === undefined) {
        return;
    }
    const { account, processing } = args;
    if (!account) {
        throw new Error('missing account');
    }
    if (processing) {
        return;
    }
    api.dispatch(setOtfWalletProcessing({
        processing: true
    }));
    const unit = args.amount ?? parseUnits('1.0');
    const mmw_signer = await provider.getSigner(x40(account));
    const mmw_balance = await provider.getBalance(x40(account));
    let gas_limit = parseUnits('0');
    try {
        gas_limit = await mmw_signer.estimateGas({
            value: mmw_balance < unit ? mmw_balance : unit,
            to: x40(account),
        });
    } catch (ex) {
        api.dispatch(setOtfWalletProcessing({
            processing: false
        }));
        throw error(ex);
    }
    const fee_data = await provider.getFeeData();
    const gas_price_base = fee_data.gasPrice ?? 25n;
    const gas_price = gas_price_base + parseUnits('1.5', 'gwei');
    const fee = gas_limit * gas_price;
    const value = mmw_balance < unit + fee
        ? mmw_balance - fee : unit;
    const otf_wallet = await OtfManager.init();
    const otf_address = await otf_wallet.getAddress();
    try {
        const tx = await mmw_signer.sendTransaction({
            gasLimit: gas_limit, gasPrice: gas_price,
            to: otf_address, value
        });
        tx.wait(1, 5000).finally(() => {
            api.dispatch(setOtfWalletProcessing({
                processing: false
            }));
        });
    } catch (ex) {
        api.dispatch(setOtfWalletProcessing({
            processing: false
        }));
        throw error(ex);
    }
});
export const otfWithdraw = AppThunk('otf-wallet/withdraw', async (args: {
    account: OtfWallet['account'], processing: OtfWallet['processing']
}, api) => {
    const otf_wallet = await OtfManager.init();
    const provider = otf_wallet.provider;
    if (provider === null) {
        return;
    }
    const { account, processing } = args;
    if (!account) {
        throw new Error('missing account');
    }
    if (processing) {
        return;
    }
    api.dispatch(setOtfWalletProcessing({
        processing: true
    }));
    const otf_balance = await OtfManager.getBalance();
    let gas_limit = parseUnits('0');
    try {
        gas_limit = await otf_wallet.estimateGas({
            to: x40(account), value: otf_balance
        });
    } catch (ex) {
        api.dispatch(setOtfWalletProcessing({
            processing: false
        }));
        throw error(ex);
    }
    const fee_data = await provider.getFeeData();
    const gas_price_base = fee_data.gasPrice ?? 25n;
    const gas_price = gas_price_base * 1125n / 1000n;
    const fee = gas_limit * gas_price;
    const value = otf_balance - fee;
    try {
        const tx = await otf_wallet.sendTransaction({
            gasLimit: gas_limit, gasPrice: gas_price,
            to: x40(account), value
        });
        tx.wait(1, 5000).finally(() => {
            api.dispatch(setOtfWalletProcessing({
                processing: false
            }));
        });
    } catch (ex) {
        api.dispatch(setOtfWalletProcessing({
            processing: false
        }));
        throw error(ex);
    }
});
