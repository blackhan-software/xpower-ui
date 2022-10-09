import './spa.scss';

import { Bus } from '../../source/bus';
import { AddressContext, AddressProvider, DebugContext, DebugProvider } from '../../source/context';
import { leafKeys } from '../../source/functions';
import { setNftsUiAmounts, setNftsUiDetails, setNftsUiFlags, setNftsUiToggled, setPptsUiAmounts, setPptsUiDetails, setPptsUiFlags, setPptsUiToggled } from '../../source/redux/actions';
import { miningSpeedable, miningTogglable } from '../../source/redux/selectors';
import { AppDispatch, AppState, Store } from '../../source/redux/store';
import { AftWallet, Mining, Minting, Nft, NftLevels, Nfts, NftsUi, NftTokens, OtfWallet, Page, PptsUi, Token } from '../../source/redux/types';

import React, { createElement, useContext, useEffect } from 'react';
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

import * as actions from './spa-actions';

import './spa-location';
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
    const [debug] = useContext(DebugContext);
    if (debug) {
        console.count('[app.render]');
    }
    useEffect(() => {
        Bus.emit('refresh-tips');
    });
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
    const dispatch = useDispatch<AppDispatch>();
    return <form id='wallet'
        className={page === Page.About ? 'd-none' : ''}
        onSubmit={(e) => e.preventDefault()}
    >
        <UiWallet
            aft={{
                ...aft_wallet, address
            }}
            otf={{
                onToggled: (toggled) =>
                    dispatch(actions.otfToggled(toggled)),
                onDeposit: (processing) =>
                    dispatch(actions.otfDeposit(address, processing)),
                onWithdraw: (processing) =>
                    dispatch(actions.otfWithdraw(address, processing)),
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
    const dispatch = useDispatch<AppDispatch>();
    if (page !== Page.Home) {
        return null;
    }
    return <form
        id='home' onSubmit={(e) => e.preventDefault()}
    >
        <UiHome
            mining={{
                onToggle: (token) =>
                    dispatch(actions.miningToggle(address, token)),
                togglable: miningTogglable(mining, token),
                onSpeed: (token, by) =>
                    dispatch(actions.miningSpeed(address, token, by)),
                speedable: miningSpeedable(mining),
                ...mining
            }}
            minting={{
                onForget: (token, level) =>
                    dispatch(actions.mintingForget(address, token, level)),
                onMint: (token, level) =>
                    dispatch(actions.mintingMint(address, token, level)),
                ...minting
            }}
            speed={mining.speed[token]}
            token={token}
        />
    </form>;
}
function $nfts(
    page: Page, token: Token,
    nfts: Nfts, nfts_ui: NftsUi
) {
    const [address] = useContext(AddressContext);
    const dispatch = useDispatch<AppDispatch>();
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
                const lhs_keys = leafKeys(lhs);
                if (lhs_keys.length) {
                    dispatch(setNftsUiFlags({ flags: lhs }));
                    dispatch(setPptsUiFlags({ flags: lhs }));
                }
                const rhs_keys = leafKeys(rhs);
                if (rhs_keys.length) {
                    dispatch(setNftsUiAmounts({
                        amounts: { [nft_token]: rhs }
                    }));
                }
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
                const details = Object.fromEntries(
                    Array.from(NftTokens()).map((t) => [t, {
                        [nft_level]: { [nft_issue]: { expanded } }
                    }])
                );
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
            onNftTransfer={(issue, level) =>
                dispatch(actions.nftTransfer(address, token, issue, level))
            }
            onNftMinterApproval={(token) =>
                dispatch(actions.nftApprove(address, token))
            }
            onNftMinterBatchMint={(token, list) =>
                dispatch(actions.nftBatchMint(address, token, list))
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
    const dispatch = useDispatch<AppDispatch>();
    if (page !== Page.Ppts) {
        return null;
    }
    const ppt_token = Nft.token(token);
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
                        amounts: { [ppt_token]: rhs }
                    }));
                }
            }}
            onPptImageLoaded={(
                ppt_issue, ppt_level
            ) => {
                const details = {
                    [ppt_token]: {
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
                const details = Object.fromEntries(
                    Array.from(NftTokens()).map((t) => [t, {
                        [ppt_level]: { [ppt_issue]: { expanded } }
                    }])
                );
                dispatch(setNftsUiDetails({ details }));
                dispatch(setPptsUiDetails({ details }));
            }}
            onPptAmountChanged={(
                ppt_issue, ppt_level, value, valid
            ) => {
                const details = {
                    [ppt_token]: {
                        [ppt_level]: {
                            [ppt_issue]: {
                                amount: { valid, value }
                            }
                        }
                    }
                };
                dispatch(setPptsUiDetails({ details }));
            }}
            onPptTargetChanged={(
                ppt_issue, ppt_level, value, valid
            ) => {
                const details = {
                    [ppt_token]: {
                        [ppt_level]: {
                            [ppt_issue]: {
                                target: { valid, value }
                            }
                        }
                    }
                };
                dispatch(setPptsUiDetails({ details }));
            }}
            onPptClaim={(issue, level) =>
                dispatch(actions.pptClaim(address, token, issue, level))
            }
            onPptMinterApproval={(t) =>
                dispatch(actions.pptApprove(address, t))
            }
            onPptMinterBatchMint={(token, list) =>
                dispatch(actions.pptBatchMint(address, token, list))
            }
            onPptMinterBatchBurn={(token, list) =>
                dispatch(actions.pptBatchBurn(address, token, list))
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
if (require.main === module) {
    const $spa = createElement(connect((s: AppState) => s)(SPA));
    const $content = document.querySelector('content');
    createRoot($content!).render(
        <Provider store={Store.store}>
            <DebugProvider>
                <AddressProvider>{$spa}</AddressProvider>
            </DebugProvider>
        </Provider>
    );
}
export default SPA;
