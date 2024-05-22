import './spa.scss';

import { Bus } from '../../source/bus';
import { leafKeys } from '../../source/functions';
import { AccountContext, AccountProvider, AccountsContext, AccountsProvider, DebugContext, DebugProvider, RpcProvider, TokenProvider, UiProvider, WalletProvider } from '../../source/react';
import { setNftsUiAmounts, setNftsUiDetails, setNftsUiFlags, setNftsUiToggled, setPptsUiAmounts, setPptsUiDetails, setPptsUiFlags, setPptsUiToggled } from '../../source/redux/actions';
import { miningSpeedable, miningTogglable } from '../../source/redux/selectors';
import { AppDispatch, AppState, Store } from '../../source/redux/store';
import { AftWallet, History, MinerStatus, Mining, Minting, NftLevels, Nfts, NftsUi, OtfWallet, Page, PptsUi, Rates, RatesUi } from '../../source/redux/types';

import React, { createElement, useContext, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, connect, useDispatch } from 'react-redux';

import { UiAbout } from '../about/about';
import { UiConnector } from '../connector/connector';
import { UiCover } from '../cover/cover';
import { UiMine } from '../mine/mine';
import { UiNfts } from '../nfts/nfts';
import { UiPpts } from '../ppts/ppts';
import { UiSwap } from '../swap/swap';
import { UiWallet } from '../wallet/wallet';

import Years from '../../source/years';
import * as actions from './spa-actions';
import { $notify } from './spa-notify';

type Props = {
    page: Page;
    history: History;
    mining: Mining;
    minting: Minting;
    nfts: Nfts;
    nfts_ui: NftsUi;
    ppts: Nfts;
    ppts_ui: PptsUi;
    aft_wallet: AftWallet;
    otf_wallet: OtfWallet;
    rates: Rates;
    rates_ui: RatesUi;
}
export function SPA(
    props: Props
) {
    const [debug] = useContext(DebugContext);
    if (debug) {
        console.count('[app.render]');
    }
    useEffect(() => {
        Bus.emit('refresh-tips');
    });
    const { aft_wallet, otf_wallet } = props;
    const { mining, minting } = props;
    const { rates, rates_ui } = props;
    const { nfts, nfts_ui } = props;
    const { ppts, ppts_ui } = props;
    const { page, history } = props;
    return <React.StrictMode>
        {$notify(history)}
        {$h1(page)}
        {$connector(page)}
        {$cover(page, mining, rates, rates_ui)}
        {$wallet(page, aft_wallet, otf_wallet)}
        {$mine(page, mining, minting)}
        {$nfts(page, nfts, nfts_ui)}
        {$ppts(page, ppts, ppts_ui)}
        {$swap(page)}
        {$about(page)}
    </React.StrictMode>;
}
function $h1(
    page: Page
) {
    if (page === Page.Mine) {
        return <h1>Mine & Mint Proof-of-Work XPower Tokens</h1>;
    }
    if (page === Page.Nfts) {
        return <h1>Mint stakeable XPower NFTs</h1>;
    }
    if (page === Page.Ppts) {
        return <h1>Stake minted XPower NFTs</h1>;
    }
    if (page === Page.Swap) {
        return <h1>Swap XPower & APower Tokens</h1>;
    }
    return null;
}
function $connector(
    page: Page
) {
    if (page !== Page.Mine &&
        page !== Page.Nfts &&
        page !== Page.Ppts &&
        page !== Page.Swap
    ) {
        return null;
    }
    return <form
        id='connector' onSubmit={(e) => e.preventDefault()}
    >
        <UiConnector />
    </form>;
}
function $cover(
    page: Page, mining: Mining, rates: Rates, rates_ui: RatesUi
) {
    const refresher_status = () => {
        const { status } = rates_ui.refresher;
        return status;
    };
    const pulsate = () => {
        switch (mining.status) {
            case MinerStatus.stopping:
            case MinerStatus.started:
            case MinerStatus.pausing:
                return true;
        }
        return false;
    };
    const dispatch = useDispatch<AppDispatch>();
    return <UiCover
        controls={{
            refresher: {
                onRefresh: (all_levels) =>
                    dispatch(actions.ratesRefresh({ all_levels })),
                status: refresher_status()
            }
        }}
        options={{
            pulsate: pulsate()
        }}
        data={{
            rates
        }}
        page={page}
    />;
}
function $wallet(
    page: Page,
    aft_wallet: AftWallet,
    otf_wallet: OtfWallet
) {
    const [account, set_account] = useContext(AccountContext);
    const [accounts] = useContext(AccountsContext);
    const dispatch = useDispatch<AppDispatch>();
    if (page !== Page.Mine &&
        page !== Page.Nfts &&
        page !== Page.Ppts &&
        page !== Page.Swap
    ) {
        return null;
    }
    return <form
        id='wallet' onSubmit={(e) => e.preventDefault()}
    >
        <UiWallet
            aft={{
                onBurn: (token, amount) =>
                    dispatch(actions.aftBurn({ account, token, amount })),
                ...aft_wallet, accounts, account, set_account
            }}
            otf={{
                onToggled: (toggled) =>
                    dispatch(actions.otfToggle({ toggled })),
                onDeposit: (processing, amount) =>
                    dispatch(actions.otfDeposit({ account, processing, amount })),
                onWithdraw: (processing) =>
                    dispatch(actions.otfWithdraw({ account, processing })),
                ...otf_wallet
            }}
        />
    </form>;
}
function $mine(
    page: Page, mining: Mining, minting: Minting
) {
    const [account] = useContext(AccountContext);
    const dispatch = useDispatch<AppDispatch>();
    if (page !== Page.Mine) {
        return null;
    }
    return <form
        id='mine' onSubmit={(e) => e.preventDefault()}
    >
        <UiMine
            mining={{
                onToggle: () =>
                    dispatch(actions.miningToggle({ account })),
                togglable: miningTogglable(mining),
                onSpeed: (by) =>
                    dispatch(actions.miningSpeed({ account, by })),
                speedable: miningSpeedable(mining),
                ...mining
            }}
            minting={{
                onIgnore: (level, flag) =>
                    dispatch(actions.mintingIgnore({ level, flag })),
                onForget: (level) =>
                    dispatch(actions.mintingForget({ account, level })),
                onMint: (level) =>
                    dispatch(actions.mintingMint({ account, level })),
                ...minting
            }}
            speed={mining.speed}
        />
    </form>;
}
function $nfts(
    page: Page, nfts: Nfts, nfts_ui: NftsUi
) {
    const [account] = useContext(AccountContext);
    const dispatch = useDispatch<AppDispatch>();
    if (page !== Page.Nfts) {
        return null;
    }
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
                const lhs_keys = leafKeys(lhs);
                if (lhs_keys.length) {
                    dispatch(setNftsUiFlags({ flags: lhs }));
                    dispatch(setPptsUiFlags({ flags: lhs }));
                }
                const rhs_keys = leafKeys(rhs);
                if (rhs_keys.length) {
                    dispatch(setNftsUiAmounts({
                        amounts: rhs
                    }));
                }
            }}
            onNftImageLoaded={(
                nft_issue, nft_level
            ) => {
                const details = {
                    [nft_level]: {
                        [nft_issue]: {
                            image: { loading: false }
                        }
                    }
                };
                dispatch(setNftsUiDetails({ details }));
            }}
            onNftSenderExpanded={(
                nft_issue, nft_level, expanded
            ) => {
                const by_issues = Object.fromEntries(
                    Array.from(Years()).map((y) => [y, { expanded }])
                );
                const by_levels = Object.fromEntries(
                    Array.from(NftLevels()).map((l) => [l, by_issues])
                );
                dispatch(setNftsUiDetails({ details: by_levels }));
                dispatch(setPptsUiDetails({ details: by_levels }));
            }}
            onNftAmountChanged={(
                nft_issue, nft_level, value, valid
            ) => {
                const details = {
                    [nft_level]: {
                        [nft_issue]: {
                            amount: { valid, value }
                        }
                    }
                };
                dispatch(setNftsUiDetails({ details }));
            }}
            onNftTargetChanged={(
                nft_issue, nft_level, value, valid
            ) => {
                const details = {
                    [nft_level]: {
                        [nft_issue]: {
                            target: { valid, value }
                        }
                    }
                };
                dispatch(setNftsUiDetails({ details }));
            }}
            onNftTransfer={(issue, level) =>
                dispatch(actions.nftsTransfer({
                    account, issue, level
                }))
            }
            onNftMinterApproval={() =>
                dispatch(actions.nftsApprove({
                    account
                }))
            }
            onNftMinterBatchMint={(list) =>
                dispatch(actions.nftsBatchMint({
                    account, list
                }))
            }
            onNftMinterBatchBurn={(list) =>
                dispatch(actions.nftsBatchBurn({
                    account, list
                }))
            }
            onNftMinterBatchUpgrade={(list) =>
                dispatch(actions.nftsBatchUpgrade({
                    account, list
                }))
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
        />
    </form>;
}
function $ppts(
    page: Page, ppts: Nfts, ppts_ui: PptsUi
) {
    const [account] = useContext(AccountContext);
    const dispatch = useDispatch<AppDispatch>();
    if (page !== Page.Ppts) {
        return null;
    }
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
                const lhs_keys = leafKeys(lhs);
                if (lhs_keys.length) {
                    dispatch(setNftsUiFlags({ flags: lhs }));
                    dispatch(setPptsUiFlags({ flags: lhs }));
                }
                const rhs_keys = leafKeys(rhs);
                if (rhs_keys.length) {
                    dispatch(setPptsUiAmounts({
                        amounts: rhs
                    }));
                }
            }}
            onPptImageLoaded={(
                ppt_issue, ppt_level
            ) => {
                const details = {
                    [ppt_level]: {
                        [ppt_issue]: {
                            image: { loading: false }
                        }
                    }
                };
                dispatch(setPptsUiDetails({ details }));
            }}
            onPptClaimerExpanded={(
                ppt_issue, ppt_level, expanded
            ) => {
                const by_issues = Object.fromEntries(
                    Array.from(Years()).map((y) => [y, { expanded }])
                );
                const by_levels = Object.fromEntries(
                    Array.from(NftLevels()).map((l) => [l, by_issues])
                );
                dispatch(setNftsUiDetails({ details: by_levels }));
                dispatch(setPptsUiDetails({ details: by_levels }));
            }}
            onPptAmountChanged={(
                ppt_issue, ppt_level, value, valid
            ) => {
                const details = {
                    [ppt_level]: {
                        [ppt_issue]: {
                            amount: { valid, value }
                        }
                    }
                };
                dispatch(setPptsUiDetails({ details }));
            }}
            onPptTargetChanged={(
                ppt_issue, ppt_level, value, valid
            ) => {
                const details = {
                    [ppt_level]: {
                        [ppt_issue]: {
                            target: { valid, value }
                        }
                    }
                };
                dispatch(setPptsUiDetails({ details }));
            }}
            onPptClaim={(issue, level) =>
                dispatch(actions.pptsClaim({
                    account, issue, level
                }))
            }
            onPptMinterApproval={() =>
                dispatch(actions.pptsApprove({
                    account
                }))
            }
            onPptMinterBatchMint={(list) =>
                dispatch(actions.pptsBatchMint({
                    account, list
                }))
            }
            onPptMinterBatchBurn={(list) =>
                dispatch(actions.pptsBatchBurn({
                    account, list
                }))
            }
            onPptMinterBatchClaim={() => {
                dispatch(actions.pptsBatchClaim({
                    account
                }));
            }}
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
        />
    </form>;
}
function $swap(
    page: Page
) {
    const classes = page !== Page.Swap
        ? 'flex-grow-1 mb-3 d-none'
        : 'flex-grow-1 mb-3';
    return <form
        id='swap' className={classes}
        onSubmit={(e) => e.preventDefault()}
    >
        <UiSwap page={page} />
    </form>;
}
function $about(
    page: Page
) {
    if (page !== Page.About) {
        return null;
    }
    return <form
        id='about' onSubmit={(e) => e.preventDefault()}
    >
        <UiAbout />
    </form>;
}
function UiSPA() {
    const $spa = createElement(connect((s: AppState) => s)(SPA));
    return <Provider store={Store()}>
        <DebugProvider>
            <RpcProvider>
                <AccountsProvider>
                    <AccountProvider>
                        <TokenProvider>
                            <WalletProvider>
                                <UiProvider>{$spa}</UiProvider>
                            </WalletProvider>
                        </TokenProvider>
                    </AccountProvider>
                </AccountsProvider>
            </RpcProvider>
        </DebugProvider>
    </Provider>;
}
if (require.main === module) {
    const $content = document.querySelector('content');
    createRoot($content!).render(<UiSPA />);
}
export default UiSPA;
