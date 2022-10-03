/* eslint @typescript-eslint/no-explicit-any: [off] */
import './spa.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { AddressContext, AddressProvider } from '../../source/context';
import { MoeTreasuryFactory, OnClaim, OnStakeBatch, OnUnstakeBatch, PptTreasuryFactory } from '../../source/contract';
import { Alert, alert, Alerts, ancestor, globalRef, x40 } from '../../source/functions';
import { HashManager, MiningManager } from '../../source/managers';
import { removeNonce, removeNonceByAmount, setMintingRow, setNftsUiAmounts, setNftsUiDetails, setNftsUiFlags, setNftsUiMinter, setNftsUiToggled, setOtfWalletProcessing, setPptsUiAmounts, setPptsUiDetails, setPptsUiFlags, setPptsUiMinter, setPptsUiToggled } from '../../source/redux/actions';
import { miningSpeedable, miningTogglable } from '../../source/redux/selectors';
import { Address, AftWallet, Amount, Level, MAX_UINT256, Mining, MinterStatus, Minting, Nft, NftCoreId, NftIssue, NftLevel, NftLevels, NftMinterApproval, NftMinterList, NftMinterStatus, Nfts, NftSenderStatus, NftsUi, OtfWallet, Page, PptBurnerStatus, PptClaimerStatus, PptMinterApproval, PptMinterList, PptMinterStatus, PptsUi, State, Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { MoeWallet, NftWallet, OnApproval, OnApprovalForAll, OnTransfer, OnTransferBatch, OnTransferSingle, OtfManager } from '../../source/wallet';
import { Years } from '../../source/years';

import { Dispatch } from '@reduxjs/toolkit';
import React, { createElement, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { connect, Provider, useDispatch } from 'react-redux';

import { Avalanche } from '../../public/images/tsx';
import { UiAbout } from '../about/about';
import { UiConnector } from '../connector/connector';
import { UiHome } from '../home/home';
import { UiNfts } from '../nfts/nfts';
import { UiPpts } from '../ppts/ppts';
import { UiSelector } from '../selector/selector';
import { UiWallet } from '../wallet/wallet';

import { Web3Provider } from '@ethersproject/providers';
import { parseUnits } from '@ethersproject/units';
import { Transaction } from 'ethers';

import './spa-mining';
import './spa-minting';
import './spa-nfts';
import './spa-nfts-ui';
import './spa-ppts';
import './spa-ppts-ui';
import './spa-wallet';

type Props = {
    page: Page;
    token: Token;
    mining: Mining;
    minting: Minting;
    nfts: Nfts;
    nfts_ui: NftsUi;
    ppts: Nfts;
    ppts_ui: PptsUi;
    aft_wallet: AftWallet;
    otf_wallet: OtfWallet;
}
export function SPA(
    props: Props
) {
    if (App.debug) {
        console.count('[app.render]');
    }
    const { aft_wallet, otf_wallet } = props;
    const { mining, minting } = props;
    const { nfts, nfts_ui } = props;
    const { ppts, ppts_ui } = props;
    const { page, token } = props;
    return <React.StrictMode>
        {$h1(page)}
        {$connector(page)}
        {$wallet(page, token, aft_wallet, otf_wallet)}
        {$selector(page, token)}
        {$home(page, token, mining, minting)}
        {$nfts(page, token, nfts, nfts_ui)}
        {$ppts(page, token, ppts, ppts_ui)}
        {$about(page, token)}
    </React.StrictMode>;
}
function $h1(
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
function $connector(
    page: Page
) {
    return <form id='connector'
        className={page === Page.About ? 'd-none' : ''}
        onSubmit={(e) => e.preventDefault()}
    >
        <UiConnector />
    </form>;
}
function $wallet(
    page: Page, token: Token,
    aft_wallet: AftWallet,
    otf_wallet: OtfWallet
) {
    const [address] = useContext(AddressContext);
    const dispatch = useDispatch();
    return <form id='wallet'
        className={page === Page.About ? 'd-none' : ''}
        onSubmit={(e) => e.preventDefault()}
    >
        <UiWallet
            aft={{
                ...aft_wallet, address
            }}
            otf={{
                onDeposit: otfDeposit(dispatch).bind(null, address),
                onWithdraw: otfWithdraw(dispatch).bind(null, address),
                ...otf_wallet
            }}
            token={token}
        />
    </form>;
}
function $selector(
    page: Page, token: Token
) {
    return <form id='selector'
        className={page === Page.About ? 'd-none' : ''}
        onSubmit={(e) => e.preventDefault()}
    >
        <UiSelector token={token} />
    </form>;
}
function $home(
    page: Page, token: Token,
    mining: Mining, minting: Minting
) {
    const [address] = useContext(AddressContext);
    const dispatch = useDispatch();
    if (page !== Page.Home) {
        return null;
    }
    return <form
        id='home' onSubmit={(e) => e.preventDefault()}
    >
        <UiHome
            mining={{
                onToggle: miningToggle(dispatch).bind(null, address),
                togglable: miningTogglable(mining),
                onSpeed: miningSpeed(dispatch).bind(null, address),
                speedable: miningSpeedable(mining),
                ...mining
            }}
            minting={{
                onForget: mintingForget(dispatch).bind(null, address),
                onMint: mintingMint(dispatch).bind(null, address),
                ...minting
            }}
            speed={mining.speed}
            token={token}
        />
    </form>;
}
function $nfts(
    page: Page, token: Token,
    nfts: Nfts, nfts_ui: NftsUi
) {
    const [address] = useContext(AddressContext);
    const dispatch = useDispatch();
    if (page !== Page.Nfts) {
        return null;
    }
    const nft_token = Nft.token(token);
    return <form
        id='nfts' onSubmit={(e) => e.preventDefault()}
    >
        <UiNfts
            nfts={nfts}
            amounts={nfts_ui.amounts}
            details={nfts_ui.details}
            flags={nfts_ui.flags}
            minter={nfts_ui.minter}
            toggled={nfts_ui.toggled}
            onNftList={(lhs, rhs) => {
                dispatch(setNftsUiAmounts({
                    amounts: { [nft_token]: rhs }
                }));
                dispatch(setNftsUiFlags({
                    flags: lhs
                }));
                dispatch(setPptsUiFlags({
                    flags: lhs
                }));
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
                dispatch(setNftsUiDetails({ details }));
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
                dispatch(setNftsUiDetails({ details }));
                dispatch(setPptsUiDetails({ details }));
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
                dispatch(setNftsUiDetails({ details }));
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
                dispatch(setNftsUiDetails({ details }));
            }}
            onNftTransfer={
                (issue, level) => nftTransfer(dispatch)(
                    address, token, issue, level
                )
            }
            onNftMinterApproval={
                nftApprove(dispatch).bind(null, address)
            }
            onNftMinterBatchMint={
                nftBatchMint(dispatch).bind(null, address)
            }
            onNftMinterToggled={(toggled) => {
                const flags = Object.fromEntries(
                    Array.from(NftLevels()).map(
                        (nft_level) => [nft_level, {
                            toggled
                        }]
                    )
                );
                dispatch(setNftsUiToggled({ toggled }));
                dispatch(setNftsUiFlags({ flags }));
                dispatch(setPptsUiToggled({ toggled }));
                dispatch(setPptsUiFlags({ flags }));
            }}
            token={token}
        />
    </form>;
}
function $ppts(
    page: Page, token: Token,
    ppts: Nfts, ppts_ui: PptsUi
) {
    const [address] = useContext(AddressContext);
    const dispatch = useDispatch();
    if (page !== Page.Ppts) {
        return null;
    }
    const nft_token = Nft.token(token);
    return <form
        id='ppts' onSubmit={(e) => e.preventDefault()}
    >
        <UiPpts
            ppts={ppts}
            amounts={ppts_ui.amounts}
            details={ppts_ui.details}
            flags={ppts_ui.flags}
            minter={ppts_ui.minter}
            toggled={ppts_ui.toggled}
            onPptList={(lhs, rhs) => {
                dispatch(setNftsUiFlags({
                    flags: lhs
                }));
                dispatch(setPptsUiFlags({
                    flags: lhs
                }));
                dispatch(setPptsUiAmounts({
                    amounts: { [nft_token]: rhs }
                }));
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
                dispatch(setPptsUiDetails({ details }));
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
                dispatch(setNftsUiDetails({ details }));
                dispatch(setPptsUiDetails({ details }));
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
                dispatch(setPptsUiDetails({ details }));
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
                dispatch(setPptsUiDetails({ details }));
            }}
            onPptClaim={
                (issue, level) => pptClaim(dispatch)(
                    address, token, issue, level
                )
            }
            onPptMinterApproval={
                pptApprove(dispatch).bind(null, address)
            }
            onPptMinterBatchMint={
                pptBatchMint(dispatch).bind(null, address)
            }
            onPptMinterBatchBurn={
                pptBatchBurn(dispatch).bind(null, address)
            }
            onPptMinterToggled={(toggled) => {
                const flags = Object.fromEntries(
                    Array.from(NftLevels()).map(
                        (nft_level) => [nft_level, {
                            toggled
                        }]
                    )
                );
                dispatch(setPptsUiToggled({ toggled }));
                dispatch(setPptsUiFlags({ flags }));
                dispatch(setNftsUiToggled({ toggled }));
                dispatch(setNftsUiFlags({ flags }));
            }}
            token={token}
        />
    </form>;
}
function $about(
    page: Page, token: Token
) {
    if (page !== Page.About) {
        return null;
    }
    return <form
        id='about' onSubmit={(e) => e.preventDefault()}
    >
        <UiAbout token={token} />
    </form>;
}
/**
 * mining:
 */
const miningToggle = (_: Dispatch) => (
    address: Address | null, token: Token
) => {
    if (!address) {
        throw new Error('missing selected-address');
    }
    MiningManager.toggle(address, { token });
}
const miningSpeed = (_: Dispatch) => (
    address: Address | null, token: Token, by: number
) => {
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
const mintingMint = (dispatch: Dispatch) => async (
    address: Address | null, token: Token, level: Level
) => {
    if (!address) {
        throw new Error('missing selected-address');
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
    Alerts.hide();
    try {
        const on_transfer: OnTransfer = async (
            from, to, amount, ev
        ) => {
            if (ev.transactionHash !== mint.hash) {
                return;
            }
            moe_wallet.offTransfer(on_transfer);
            if (App.token !== token) {
                return;
            }
            const { tx_counter } = App.getMintingRow({
                level
            });
            if (tx_counter > 0) dispatch(setMintingRow(
                { level, row: { tx_counter: tx_counter - 1 } }
            ));
        };
        dispatch(setMintingRow(
            { level, row: { status: MinterStatus.minting } }
        ));
        const mint = await moe_wallet.mint(
            block_hash, nonce
        );
        console.debug('[mint]', mint);
        moe_wallet.onTransfer(on_transfer);
        const { tx_counter } = App.getMintingRow(
            { level }
        );
        dispatch(setMintingRow({
            level, row: {
                status: MinterStatus.minted,
                tx_counter: tx_counter + 1
            }
        }));
        dispatch(removeNonce(nonce, {
            address, block_hash, token
        }));
    } catch (ex: any) {
        dispatch(setMintingRow({
            level, row: {
                status: MinterStatus.error
            }
        }));
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
                dispatch(removeNonce(nonce, {
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
}
const mintingForget = (dispatch: Dispatch) => (
    address: Address | null, token: Token, level: Level
) => {
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
        dispatch(removeNonceByAmount(item));
    }
}
/**
 * nft-sender:
 */
const nftTransfer = (dispatch: Dispatch) => async (
    address: Address | null, token: Token,
    nft_issue: NftIssue, nft_level: NftLevel
) => {
    if (!address) {
        throw new Error('missing selected-address');
    }
    const nft_token = Nft.token(
        token
    );
    const core_id = Nft.coreId({
        issue: nft_issue, level: nft_level
    });
    const { details } = App.getNftsUi();
    const by_token = details[nft_token];
    const by_level = by_token[nft_level];
    const by_issue = by_level[nft_issue];
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
        dispatch(setNftsUiDetails({
            details: {
                [nft_token]: {
                    [nft_level]: {
                        [nft_issue]: {
                            amount: { valid: null, value: null },
                            sender: { status: NftSenderStatus.sent }
                        }
                    }
                }
            }
        }));
    };
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        dispatch(setNftsUiDetails({
            details: {
                [nft_token]: {
                    [nft_level]: {
                        [nft_issue]: {
                            sender: { status: NftSenderStatus.sending }
                        }
                    }
                }
            }
        }));
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
        dispatch(setNftsUiDetails({
            details: {
                [nft_token]: {
                    [nft_level]: {
                        [nft_issue]: {
                            sender: { status: NftSenderStatus.error }
                        }
                    }
                }
            }
        }));
        console.error(ex);
    }
}
/**
 * nft-minter:
 */
const nftApprove = (dispatch: Dispatch) => async (
    address: Address | null, token: Token
) => {
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
        dispatch(setNftsUiMinter({
            minter: {
                [Nft.token(token)]: {
                    approval: NftMinterApproval.approved
                }
            }
        }));
    };
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        dispatch(setNftsUiMinter({
            minter: {
                [Nft.token(token)]: {
                    approval: NftMinterApproval.approving
                }
            }
        }));
        moe_wallet.onApproval(on_approval);
        const nft_contract = await nft_wallet.contract;
        tx = await moe_wallet.increaseAllowance(
            nft_contract.address, MAX_UINT256 - old_allowance
        );
    } catch (ex) {
        dispatch(setNftsUiMinter({
            minter: {
                [Nft.token(token)]: {
                    approval: NftMinterApproval.error
                }
            }
        }));
        const $button = document.querySelector<HTMLElement>(
            '#nft-batch-minting'
        );
        error(ex, { after: $button });
    }
}
const nftBatchMint = (dispatch: Dispatch) => async (
    address: Address | null, token: Token, list: NftMinterList
) => {
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
        dispatch(setNftsUiMinter({
            minter: {
                [nft_token]: {
                    status: NftMinterStatus.minted
                }
            }
        }));
    };
    const nft_wallet = new NftWallet(address, token);
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        dispatch(setNftsUiMinter({
            minter: {
                [nft_token]: {
                    status: NftMinterStatus.minting
                }
            }
        }));
        nft_wallet.onTransferBatch(on_batch_tx);
        tx = await nft_wallet.mintBatch(levels, amounts);
    } catch (ex) {
        dispatch(setNftsUiMinter({
            minter: {
                [nft_token]: {
                    status: NftMinterStatus.error
                }
            }
        }));
        const $button = document.querySelector<HTMLElement>(
            '#nft-batch-minting'
        );
        error(ex, { after: $button });
    }
}
/**
 * ppt-claimer:
 */
const pptClaim = (dispatch: Dispatch) => async (
    address: Address | null, token: Token,
    ppt_issue: NftIssue, ppt_level: NftLevel
) => {
    if (!address) {
        throw new Error('missing selected-address');
    }
    const ppt_token = Nft.token(
        token
    );
    const core_id = Nft.coreId({
        issue: ppt_issue, level: ppt_level
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
        dispatch(setPptsUiDetails({
            details: {
                [ppt_token]: {
                    [ppt_level]: {
                        [ppt_issue]: {
                            claimer: {
                                status: PptClaimerStatus.claimed
                            }
                        }
                    }
                }
            }
        }));
    };
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        dispatch(setPptsUiDetails({
            details: {
                [ppt_token]: {
                    [ppt_level]: {
                        [ppt_issue]: {
                            claimer: {
                                status: PptClaimerStatus.claiming
                            }
                        }
                    }
                }
            }
        }));
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
        dispatch(setPptsUiDetails({
            details: {
                [ppt_token]: {
                    [ppt_level]: {
                        [ppt_issue]: {
                            claimer: {
                                status: PptClaimerStatus.error
                            }
                        }
                    }
                }
            }
        }));
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
}
/**
 * ppt-minter:
 */
const pptApprove = (dispatch: Dispatch) => async (
    address: Address | null, token: Token
) => {
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
        dispatch(setPptsUiMinter({ minter }));
    } else {
        const on_approval: OnApprovalForAll = (
            account, op, flag, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            dispatch(setPptsUiMinter({
                minter: {
                    [ppt_token]: {
                        approval: PptMinterApproval.approved
                    }
                }
            }));
        };
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            dispatch(setPptsUiMinter({
                minter: {
                    [ppt_token]: {
                        approval: PptMinterApproval.approving
                    }
                }
            }));
            nft_wallet.onApprovalForAll(on_approval);
            tx = await nft_wallet.setApprovalForAll(
                await ppt_treasury.then((c) => c.address), true
            );
        } catch (ex) {
            dispatch(setPptsUiMinter({
                minter: {
                    [ppt_token]: {
                        approval: PptMinterApproval.error
                    }
                }
            }));
            const $button = document.querySelector<HTMLElement>(
                '#ppt-batch-minting'
            );
            error(ex, { after: $button });
        }
    }
}
const pptBatchMint = (dispatch: Dispatch) => async (
    address: Address | null, token: Token, list: PptMinterList
) => {
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
                const ppt_total = App.getNftTotalBy({
                    level, issue
                });
                if (ppt_total.amount === 0n) {
                    continue;
                }
                const ppt_id = Nft.coreId({
                    level, issue
                });
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
        dispatch(setPptsUiMinter({
            minter: {
                [ppt_token]: {
                    minter_status: PptMinterStatus.minted
                }
            }
        }));
    };
    const ppt_treasury = PptTreasuryFactory({
        token
    });
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        dispatch(setPptsUiMinter({
            minter: {
                [ppt_token]: {
                    minter_status: PptMinterStatus.minting
                }
            }
        }));
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
        dispatch(setPptsUiMinter({
            minter: {
                [ppt_token]: {
                    minter_status: PptMinterStatus.error
                }
            }
        }));
        const $button = document.querySelector<HTMLElement>(
            '#ppt-batch-minting'
        );
        error(ex, { after: $button });
    }
}
const pptBatchBurn = (dispatch: Dispatch) => async (
    address: Address | null, token: Token, list: PptMinterList
) => {
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
                const ppt_total = App.getPptTotalBy({
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
        dispatch(setPptsUiMinter({
            minter: {
                [ppt_token]: {
                    burner_status: PptBurnerStatus.burned
                }
            }
        }));
    };
    const ppt_treasury = PptTreasuryFactory({
        token
    });
    let tx: Transaction | undefined;
    Alerts.hide();
    try {
        dispatch(setPptsUiMinter({
            minter: {
                [ppt_token]: {
                    burner_status: PptBurnerStatus.burning
                }
            }
        }));
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
        dispatch(setPptsUiMinter({
            minter: {
                [ppt_token]: {
                    burner_status: PptBurnerStatus.error
                }
            }
        }));
        const $button = document.querySelector<HTMLElement>(
            '#ppt-batch-minting'
        );
        error(ex, { after: $button });
    }
}
/**
 * {aft,otf}-wallet:
 */
const otfDeposit = (dispatch: Dispatch) => async (
    address: Address | null, processing: boolean
) => {
    if (!address) {
        throw new Error('missing selected-address');
    }
    if (processing) {
        return;
    }
    dispatch(setOtfWalletProcessing({
        processing: true
    }));
    const unit = parseUnits('1.0');
    const provider = new Web3Provider(await Blockchain.provider);
    const mmw_signer = provider.getSigner(x40(address));
    const mmw_balance = await mmw_signer.getBalance();
    let gas_limit = parseUnits('0');
    try {
        gas_limit = await mmw_signer.estimateGas({
            value: mmw_balance.lt(unit) ? mmw_balance : unit,
            to: x40(address),
        });
    } catch (ex) {
        dispatch(setOtfWalletProcessing({
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
            dispatch(setOtfWalletProcessing({
                processing: false
            }));
        });
        console.debug('[otf-deposit]', tx);
    } catch (ex) {
        dispatch(setOtfWalletProcessing({
            processing: false
        }));
        console.error(ex);
    }
}
const otfWithdraw = (dispatch: Dispatch) => async (
    address: Address | null, processing: boolean
) => {
    if (!address) {
        throw new Error('missing selected-address');
    }
    if (processing) {
        return;
    }
    dispatch(setOtfWalletProcessing({
        processing: true
    }));
    const otf_signer = await OtfManager.init();
    const otf_balance = await otf_signer.getBalance();
    let gas_limit = parseUnits('0');
    try {
        gas_limit = await otf_signer.estimateGas({
            to: x40(address), value: otf_balance
        });
    } catch (ex) {
        dispatch(setOtfWalletProcessing({
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
            dispatch(setOtfWalletProcessing({
                processing: false
            }));
        });
        console.debug('[otf-withdraw]', tx);
    } catch (ex) {
        dispatch(setOtfWalletProcessing({
            processing: false
        }));
        console.error(ex);
    }
}
function error(ex: any, options?: {
    style?: Record<string, string>,
    icon?: string, id?: string,
    after?: HTMLElement | null
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
if (require.main === module) {
    const $spa = createElement(connect((s: State) => s)(SPA));
    const $content = document.querySelector('content');
    createRoot($content!).render(
        <Provider store={App.store}>
            <AddressProvider>{$spa}</AddressProvider>
        </Provider>
    );
}
export default SPA;
