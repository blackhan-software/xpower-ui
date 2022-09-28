/* eslint @typescript-eslint/no-explicit-any: [off] */
import './spa.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { MoeTreasuryFactory, OnClaim, OnStakeBatch, OnUnstakeBatch, PptTreasuryFactory } from '../../source/contract';
import { Alert, alert, Alerts, ancestor, Referable, x40 } from '../../source/functions';
import { HashManager, MiningManager } from '../../source/managers';
import { miningSpeedable, miningTogglable } from '../../source/redux/selectors';
import { Address, Amount, Level, MAX_UINT256, Mining, MinterRows, MinterStatus, Minting, Nft, NftCoreId, NftFlags, NftIssue, NftLevel, NftLevels, NftMinterApproval, NftMinterList, NftMinterStatus, NftSenderStatus, NftsUi, Page, PptBurnerStatus, PptClaimerStatus, PptMinterApproval, PptMinterList, PptMinterStatus, PptsUi, Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { MoeWallet, NftWallet, OnApproval, OnApprovalForAll, OnTransfer, OnTransferBatch, OnTransferSingle, OtfWallet } from '../../source/wallet';
import { Years } from '../../source/years';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { connect, Provider } from 'react-redux';

import { Avalanche } from '../../public/images/tsx';
import { UiAbout } from '../about/about';
import { Connector } from '../connector/connector';
import { UiHome } from '../home/home';
import { UiNfts } from '../nfts/nfts';
import { UiPpts } from '../ppts/ppts';
import { Selector } from '../selector/selector';
import { WalletUi } from '../wallet/wallet-ui';

import { Transaction } from 'ethers';
import './spa-home';
import './spa-nfts';
import './spa-nfts-ui';
import './spa-ppts';
import './spa-ppts-ui';

type Props = {
    page: Page;
    token: Token;
    mining: Mining;
    minting: Minting;
    nfts_ui: NftsUi;
    ppts_ui: PptsUi;
}
export class SPA extends Referable(
    React.Component<Props>
) {
    render() {
        if (App.debug) {
            console.count('[app.render]');
        }
        const { mining: { speed } } = this.props;
        const { page, token } = this.props;
        const { nfts_ui, ppts_ui } = this.props;
        return <React.StrictMode>
            {this.$h1(page)}
            {this.$connector(page)}
            {this.$wallet(page, token)}
            {this.$selector(page, token)}
            {this.$home(page, token, speed)}
            {this.$nfts(page, token, nfts_ui.flags, nfts_ui.toggled)}
            {this.$ppts(page, token, ppts_ui.flags, ppts_ui.toggled)}
            {this.$about(page, token)}
        </React.StrictMode>;
    }
    $h1(
        page: Page
    ) {
        const logo = <Avalanche height={24} width={24} />;
        if (page === Page.Home) {
            return <h1>Mine & Mint Proof-of-Work Tokens on Avalanche {logo}</h1>;
        }
        if (page === Page.Nfts) {
            return <h1>Mint stakeable XPower NFTs on Avalanche {logo}</h1>;
        }
        if (page === Page.Ppts) {
            return <h1>Stake minted XPower NFTs on Avalanche {logo}</h1>;
        }
        return null;
    }
    $connector(
        page: Page
    ) {
        return <form id='connector'
            className={page === Page.About ? 'd-none' : ''}
            onSubmit={(e) => e.preventDefault()}
        >
            <Connector />
        </form>;
    }
    $wallet(
        page: Page, token: Token
    ) {
        return <form id='wallet'
            className={page === Page.About ? 'd-none' : ''}
            onSubmit={(e) => e.preventDefault()}
        >
            <WalletUi token={token} />
        </form>;
    }
    $selector(
        page: Page, token: Token
    ) {
        return <form id='selector'
            className={page === Page.About ? 'd-none' : ''}
            onSubmit={(e) => e.preventDefault()}
        >
            <Selector token={token} />
        </form>;
    }
    $home(
        page: Page, token: Token, speed: number
    ) {
        if (page !== Page.Home) {
            return null;
        }
        const { mining, minting } = this.props;
        return <form id='home'
            onSubmit={(e) => e.preventDefault()}
        >
            <UiHome
                mining={{
                    onToggle: this.toggle.bind(this),
                    togglable: miningTogglable(mining),
                    onSpeed: this.speed.bind(this),
                    speedable: miningSpeedable(mining),
                    ...mining
                }}
                minting={{
                    onForget: this.forget.bind(this),
                    onMint: this.mint.bind(this),
                    ...minting
                }}
                speed={speed}
                token={token}
            />
        </form>;
    }
    $nfts(
        page: Page, token: Token, flags: NftFlags, toggled: boolean
    ) {
        if (page !== Page.Nfts) {
            return null;
        }
        const nft_token = Nft.token(token);
        return <form id='nfts'
            onSubmit={(e) => e.preventDefault()}
        >
            <UiNfts
                details={this.props.nfts_ui.details}
                amounts={this.props.nfts_ui.amounts}
                minter={this.props.nfts_ui.minter}
                flags={flags}
                onNftList={(lhs, rhs) => {
                    App.setNftsUi({
                        flags: lhs, amounts: { [nft_token]: rhs }
                    });
                    App.setPptsUi({
                        flags: lhs
                    });
                }}
                onNftImageLoaded={(
                    nft_issue, nft_level
                ) => {
                    const details = {
                        [nft_token]: {
                            [nft_level]: {
                                [nft_issue]: {
                                    image: { loading: false }
                                }
                            }
                        }
                    };
                    App.setNftsUi({ details });
                }}
                onNftSenderExpanded={(
                    nft_issue, nft_level, expanded
                ) => {
                    const details = {
                        [nft_token]: {
                            [nft_level]: {
                                [nft_issue]: { expanded }
                            }
                        }
                    };
                    App.setNftsUi({ details });
                    App.setPptsUi({ details });
                }}
                onNftAmountChanged={(
                    nft_issue, nft_level, value, valid
                ) => {
                    const details = {
                        [nft_token]: {
                            [nft_level]: {
                                [nft_issue]: {
                                    amount: { valid, value }
                                }
                            }
                        }
                    };
                    App.setNftsUi({ details });
                }}
                onNftTargetChanged={(
                    nft_issue, nft_level, value, valid
                ) => {
                    const details = {
                        [nft_token]: {
                            [nft_level]: {
                                [nft_issue]: {
                                    target: { valid, value }
                                }
                            }
                        }
                    };
                    App.setNftsUi({ details });
                }}
                onNftTransfer={
                    this.nftTransfer.bind(this)
                }
                onNftMinterApproval={
                    this.nftApprove.bind(this)
                }
                onNftMinterBatchMint={
                    this.nftBatchMint.bind(this)
                }
                onNftMinterToggled={(toggled) => {
                    const flags = Object.fromEntries(
                        Array.from(NftLevels()).map(
                            (nft_level) => [nft_level, {
                                toggled
                            }]
                        )
                    );
                    App.setNftsUi({ flags, toggled });
                    App.setPptsUi({ flags, toggled });
                }}
                toggled={toggled}
                token={token}
            />
        </form>;
    }
    $ppts(
        page: Page, token: Token, flags: NftFlags, toggled: boolean
    ) {
        if (page !== Page.Ppts) {
            return null;
        }
        const nft_token = Nft.token(token);
        return <form id='nfts'
            onSubmit={(e) => e.preventDefault()}
        >
            <UiPpts
                details={this.props.ppts_ui.details}
                amounts={this.props.ppts_ui.amounts}
                minter={this.props.ppts_ui.minter}
                flags={flags}
                onPptList={(lhs, rhs) => {
                    App.setNftsUi({
                        flags: lhs
                    });
                    App.setPptsUi({
                        flags: lhs, amounts: { [nft_token]: rhs }
                    });
                }}
                onPptImageLoaded={(
                    ppt_issue, ppt_level
                ) => {
                    const details = {
                        [nft_token]: {
                            [ppt_level]: {
                                [ppt_issue]: {
                                    image: { loading: false }
                                }
                            }
                        }
                    };
                    App.setPptsUi({ details });
                }}
                onPptClaimerExpanded={(
                    ppt_issue, ppt_level, expanded
                ) => {
                    const details = {
                        [nft_token]: {
                            [ppt_level]: {
                                [ppt_issue]: {
                                    expanded
                                }
                            }
                        }
                    };
                    App.setNftsUi({ details });
                    App.setPptsUi({ details });
                }}
                onPptAmountChanged={(
                    nft_issue, nft_level, value, valid
                ) => {
                    const details = {
                        [nft_token]: {
                            [nft_level]: {
                                [nft_issue]: {
                                    amount: { valid, value }
                                }
                            }
                        }
                    };
                    App.setPptsUi({ details });
                }}
                onPptTargetChanged={(
                    nft_issue, nft_level, value, valid
                ) => {
                    const details = {
                        [nft_token]: {
                            [nft_level]: {
                                [nft_issue]: {
                                    target: { valid, value }
                                }
                            }
                        }
                    };
                    App.setPptsUi({ details });
                }}
                onPptClaim={
                    this.pptClaim.bind(this)
                }
                onPptMinterApproval={
                    this.pptApprove.bind(this)
                }
                onPptMinterBatchMint={
                    this.pptBatchMint.bind(this)
                }
                onPptMinterBatchBurn={
                    this.pptBatchBurn.bind(this)
                }
                onPptMinterToggled={(toggled) => {
                    const flags = Object.fromEntries(
                        Array.from(NftLevels()).map(
                            (nft_level) => [nft_level, {
                                toggled
                            }]
                        )
                    );
                    App.setNftsUi({ flags, toggled });
                    App.setPptsUi({ flags, toggled });
                }}
                toggled={toggled}
                token={token}
            />
        </form>;
    }
    $about(
        page: Page, token: Token
    ) {
        if (page !== Page.About) {
            return null;
        }
        return <form id='about'
            onSubmit={(e) => e.preventDefault()}
        >
            <UiAbout token={token} />
        </form>;
    }
    /**
     * mining:
     */
    async toggle(
        token: Token
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        MiningManager.toggle(address, { token });
    }
    async speed(
        token: Token, by: number
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const miner = MiningManager.miner(address, {
            token
        });
        if (by > 0) {
            miner.increase(by * (+1));
        } else {
            miner.decrease(by * (-1));
        }
    }
    /**
     * minting:
     */
    async mint(
        token: Token, level: Level
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        } else {
            Alerts.hide();
        }
        const amount = Tokenizer.amount(token, level);
        const block_hash = HashManager.latestHash({
            slot: Tokenizer.lower(token)
        });
        if (!block_hash) {
            throw new Error('missing block-hash');
        }
        const { nonce } = App.getNonceBy({
            address, amount, block_hash, token
        });
        if (!nonce) {
            throw new Error(`missing nonce for amount=${amount}`);
        }
        const moe_wallet = new MoeWallet(address, token);
        try {
            const on_transfer: OnTransfer = async (
                from, to, amount, ev
            ) => {
                if (ev.transactionHash !== mint.hash) {
                    return;
                }
                moe_wallet.offTransfer(on_transfer);
                if (token !== this.props.token) {
                    return;
                }
                const { tx_counter } = MinterRows.get(
                    this.props.minting.rows, level - 1
                );
                if (tx_counter > 0) {
                    const rows = MinterRows.set(
                        this.props.minting.rows, level - 1, {
                        tx_counter: tx_counter - 1
                    });
                    App.setMinting({ rows });
                }
            };
            App.setMinting({
                rows: MinterRows.set(
                    this.props.minting.rows, level - 1, {
                    status: MinterStatus.minting,
                })
            });
            const mint = await moe_wallet.mint(
                block_hash, nonce
            );
            console.debug('[mint]', mint);
            moe_wallet.onTransfer(on_transfer);
            const { tx_counter } = MinterRows.get(
                this.props.minting.rows, level - 1
            );
            App.setMinting({
                rows: MinterRows.set(
                    this.props.minting.rows, level - 1, {
                    status: MinterStatus.minted,
                    tx_counter: tx_counter + 1
                })
            });
            App.removeNonce(nonce, {
                address, block_hash, token
            });
        } catch (ex: any) {
            App.setMinting({
                rows: MinterRows.set(
                    this.props.minting.rows, level - 1, {
                    status: MinterStatus.error
                })
            });
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
                    if (OtfWallet.enabled) {
                        const miner = MiningManager.miner(address, {
                            token
                        });
                        if (miner.running) {
                            miner.pause();
                        }
                    }
                }
                if (ex.data && ex.data.message && ex.data.message.match(
                    /empty nonce-hash/i
                )) {
                    App.removeNonce(nonce, {
                        address, block_hash, token
                    });
                }
            }
            const $mint = this.globalRef<HTMLElement>(
                `.mint[level="${level}"]`
            );
            this.error(ex, {
                after: $mint.current, id: `${nonce}`
            });
        }
    }
    async forget(
        token: Token, level: Level
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const amount = Tokenizer.amount(
            token, level
        );
        const result = App.getNoncesBy({
            address, amount, token
        });
        for (const { item } of result) {
            App.removeNonceByAmount(item);
        }
    }
    /**
     * nft-sender:
     */
    async nftTransfer(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const nft_token = Nft.token(
            this.props.token
        );
        const core_id = Nft.coreId({
            issue: nft_issue, level: nft_level
        });
        const by_token = this.props.nfts_ui.details[nft_token];
        const by_level = by_token[nft_level];
        const by_issue = by_level[nft_issue];
        const target = by_issue.target.value as Address;
        const amount = by_issue.amount.value as Amount;
        const nft_wallet = new NftWallet(
            address, this.props.token
        );
        const on_single_tx: OnTransferSingle = async (
            op, from, to, id, value, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            const details = {
                [nft_token]: {
                    [nft_level]: {
                        [nft_issue]: {
                            amount: { valid: null, value: null },
                            sender: { status: NftSenderStatus.sent }
                        }
                    }
                }
            };
            App.setNftsUi({ details });
        };
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            const details = {
                [nft_token]: {
                    [nft_level]: {
                        [nft_issue]: {
                            sender: { status: NftSenderStatus.sending }
                        }
                    }
                }
            };
            App.setNftsUi({
                details
            });
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
                const $ref = this.globalRef<HTMLElement>(
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
            const details = {
                [nft_token]: {
                    [nft_level]: {
                        [nft_issue]: {
                            sender: { status: NftSenderStatus.error }
                        }
                    }
                }
            };
            App.setNftsUi({ details });
            console.error(ex);
        }
    }
    /**
     * nft-minter:
     */
    async nftApprove(
        token: Token
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const moe_wallet = new MoeWallet(address, token);
        const nft_wallet = new NftWallet(address, token);
        const nft_contract = await nft_wallet.contract;
        const old_allowance = await moe_wallet.allowance(
            address, nft_contract.address
        );
        const on_approval: OnApproval = (
            owner, spender, value, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            const minter = {
                [Nft.token(token)]: {
                    approval: NftMinterApproval.approved
                }
            };
            App.setNftsUi({ minter });
        };
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            const minter = {
                [Nft.token(token)]: {
                    approval: NftMinterApproval.approving
                }
            };
            App.setNftsUi({
                minter
            });
            moe_wallet.onApproval(on_approval);
            const nft_contract = await nft_wallet.contract;
            tx = await moe_wallet.increaseAllowance(
                nft_contract.address, MAX_UINT256 - old_allowance
            );
        } catch (ex) {
            const minter = {
                [Nft.token(token)]: {
                    approval: NftMinterApproval.error
                }
            };
            App.setNftsUi({
                minter
            });
            const $button = document.querySelector<HTMLElement>(
                '#nft-batch-minting'
            );
            this.error(ex, { after: $button });
        }
    }
    async nftBatchMint(
        token: Token, list: NftMinterList
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const nfts = [] as Array<{
            level: NftLevel; amount: Amount;
        }>;
        for (const level of NftLevels()) {
            const { amount } = list[level];
            if (amount) nfts.push({ level, amount });
        }
        const levels = nfts.map((nft) => nft.level);
        const amounts = nfts.map((nft) => nft.amount);
        const on_batch_tx: OnTransferBatch = async (
            op, from, to, ids, values, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            const minter = {
                [Nft.token(token)]: {
                    status: NftMinterStatus.minted
                }
            };
            App.setNftsUi({ minter });
        };
        const nft_wallet = new NftWallet(address, token);
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            const minter = {
                [Nft.token(token)]: {
                    status: NftMinterStatus.minting
                }
            };
            App.setNftsUi({
                minter
            });
            nft_wallet.onTransferBatch(on_batch_tx);
            tx = await nft_wallet.mintBatch(levels, amounts);
        } catch (ex) {
            const minter = {
                [Nft.token(token)]: {
                    status: NftMinterStatus.error
                }
            };
            App.setNftsUi({
                minter
            });
            const $button = document.querySelector<HTMLElement>(
                '#nft-batch-minting'
            );
            this.error(ex, { after: $button });
        }
    }
    /**
     * ppt-claimer:
     */
    async pptClaim(
        ppt_issue: NftIssue, ppt_level: NftLevel
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const ppt_token = Nft.token(
            this.props.token
        );
        const core_id = Nft.coreId({
            issue: ppt_issue, level: ppt_level
        });
        const moe_treasury = MoeTreasuryFactory({
            token: this.props.token
        });
        const on_claim_tx: OnClaim = async (
            acc, id, amount, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            const details = {
                [ppt_token]: {
                    [ppt_level]: {
                        [ppt_issue]: {
                            claimer: {
                                status: PptClaimerStatus.claimed
                            }
                        }
                    }
                }
            };
            App.setPptsUi({ details });
        };
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            const details = {
                [ppt_token]: {
                    [ppt_level]: {
                        [ppt_issue]: {
                            claimer: {
                                status: PptClaimerStatus.claiming
                            }
                        }
                    }
                }
            };
            App.setPptsUi({
                details
            });
            moe_treasury.then(
                (c) => c.on('Claim', on_claim_tx)
            );
            const contract = await OtfWallet.connect(
                await moe_treasury
            );
            tx = await contract.claimFor(
                x40(address), core_id
            );
        } catch (ex: any) {
            const details = {
                [ppt_token]: {
                    [ppt_level]: {
                        [ppt_issue]: {
                            claimer: {
                                status: PptClaimerStatus.error
                            }
                        }
                    }
                }
            };
            App.setPptsUi({
                details
            });
            const $ref = this.globalRef<HTMLElement>(
                `.ppt-claimer[core-id="${core_id}"]`
            );
            const $claimer_row = ancestor(
                $ref.current, (e) => e.classList.contains('row')
            );
            this.error(ex, {
                after: $claimer_row,
                style: { margin: '0.5em 0 -0.5em 0' }
            });
        }
    }
    /**
     * ppt-minter:
     */
    async pptApprove(
        token: Token
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const ppt_treasury = PptTreasuryFactory({
            token
        });
        const nft_wallet = new NftWallet(address, token);
        const approved = await nft_wallet.isApprovedForAll(
            address
        );
        if (approved) {
            const minter = {
                [Nft.token(token)]: {
                    approval: PptMinterApproval.approved
                }
            };
            App.setPptsUi({ minter });
        } else {
            const on_approval: OnApprovalForAll = (
                account, op, flag, ev
            ) => {
                if (ev.transactionHash !== tx?.hash) {
                    return;
                }
                const minter = {
                    [Nft.token(token)]: {
                        approval: PptMinterApproval.approved
                    }
                };
                App.setPptsUi({ minter });
            };
            let tx: Transaction | undefined;
            Alerts.hide();
            try {
                const minter = {
                    [Nft.token(token)]: {
                        approval: PptMinterApproval.approving
                    }
                };
                App.setPptsUi({
                    minter
                });
                nft_wallet.onApprovalForAll(on_approval);
                tx = await nft_wallet.setApprovalForAll(
                    await ppt_treasury.then((c) => c.address), true
                );
            } catch (ex) {
                const minter = {
                    [Nft.token(token)]: {
                        approval: PptMinterApproval.error
                    }
                };
                App.setPptsUi({
                    minter
                });
                const $button = document.querySelector<HTMLElement>(
                    '#ppt-batch-minting'
                );
                this.error(ex, { after: $button });
            }
        }
    }
    async pptBatchMint(
        token: Token, list: PptMinterList
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
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
                    const ppt_total = App.getNftTotalBy({ level, issue });
                    if (ppt_total.amount === 0n) {
                        continue;
                    }
                    const ppt_id = Nft.coreId({ level, issue });
                    if (mint_amount >= ppt_total.amount) {
                        ppt_mints.push({
                            ppt_id, amount: ppt_total.amount
                        });
                        mint_amount -= ppt_total.amount;
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
            const minter = {
                [Nft.token(token)]: {
                    minter_status: PptMinterStatus.minted
                }
            };
            App.setPptsUi({ minter });
        };
        const ppt_treasury = PptTreasuryFactory({
            token
        });
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            const minter = {
                [Nft.token(token)]: {
                    minter_status: PptMinterStatus.minting
                }
            };
            App.setPptsUi({
                minter
            });
            ppt_treasury.then(
                (c) => c?.on('StakeBatch', on_stake_batch)
            );
            const contract = await OtfWallet.connect(
                await ppt_treasury
            );
            tx = await contract.stakeBatch(
                x40(address), ppt_ids, amounts
            );
        } catch (ex: any) {
            const minter = {
                [Nft.token(token)]: {
                    minter_status: PptMinterStatus.error
                }
            };
            App.setPptsUi({
                minter
            });
            const $button = document.querySelector<HTMLElement>(
                '#ppt-batch-minting'
            );
            this.error(ex, { after: $button });
        }
    }
    async pptBatchBurn(
        token: Token, list: PptMinterList
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
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
                    const ppt_total = App.getPptTotalBy({ level, issue });
                    if (ppt_total.amount === 0n) {
                        continue;
                    }
                    const ppt_id = Nft.coreId({ level, issue });
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
            const minter = {
                [Nft.token(token)]: {
                    burner_status: PptBurnerStatus.burned
                }
            };
            App.setPptsUi({ minter });
        };
        const ppt_treasury = PptTreasuryFactory({
            token
        });
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            const minter = {
                [Nft.token(token)]: {
                    burner_status: PptBurnerStatus.burning
                }
            };
            App.setPptsUi({
                minter
            });
            ppt_treasury.then(
                (c) => c?.on('UnstakeBatch', on_unstake_batch)
            );
            const contract = await OtfWallet.connect(
                await ppt_treasury
            );
            tx = await contract.unstakeBatch(
                x40(address), ppt_ids, amounts
            );
        } catch (ex: any) {
            const minter = {
                [Nft.token(token)]: {
                    burner_status: PptBurnerStatus.error
                }
            };
            App.setPptsUi({
                minter
            });
            const $button = document.querySelector<HTMLElement>(
                '#ppt-batch-minting'
            );
            this.error(ex, { after: $button });
        }
    }
    error(
        ex: any, options?: {
            style?: Record<string, string>,
            icon?: string, id?: string,
            after?: HTMLElement | null
        }
    ) {
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
}
if (require.main === module) {
    const mapper = ({
        page, token, mining, minting, nfts_ui, ppts_ui
    }: {
        page: Page;
        token: Token;
        mining: Mining;
        minting: Minting;
        nfts_ui: NftsUi;
        ppts_ui: PptsUi;
    }) => ({
        page, token, mining, minting, nfts_ui, ppts_ui
    });
    const $content = document.querySelector('content');
    const spa = createElement(connect(mapper)(SPA));
    createRoot($content!).render(
        <Provider store={App.store}>{spa}</Provider>
    );
}
export default SPA;
