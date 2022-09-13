/* eslint @typescript-eslint/no-explicit-any: [off] */
import './spa.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { MoeTreasuryFactory, PptTreasuryFactory } from '../../source/contract';
import { OnClaim, OnStakeBatch, OnUnstakeBatch } from '../../source/contract';
import { Updatable, buffered, x40 } from '../../source/functions';
import { Alerts, Alert, alert } from '../../source/functions';
import { Referable, ancestor } from '../../source/functions';
import { HashManager, MiningManager } from '../../source/managers';
import { Address, Amount, Balance, Level, Page, Token } from '../../source/redux/types';
import { Nft, NftCoreId, NftIssue } from '../../source/redux/types';
import { NftToken, NftTokens } from '../../source/redux/types';
import { NftLevel, NftLevels } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { OnApprovalForAll, OnTransferBatch, OnTransferSingle } from '../../source/wallet';
import { MoeWallet, NftWallet, OtfWallet } from '../../source/wallet';
import { OnApproval, OnTransfer } from '../../source/wallet';
import { Years } from '../../source/years';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Connector } from '../connector/connector';
import { WalletUi } from '../wallet/wallet-ui';
import { Selector } from '../selector/selector';
import { UiHome, Minting } from '../home/home';
import { MinerStatus, MinterStatus, MinterRow } from '../home/home';
import { UiNfts, nft_meta, nft_href } from '../nfts/nfts';
import { UiPpts, ppt_meta, ppt_href } from '../ppts/ppts';
import { NftList, nft_list } from '../nfts/nfts';
import { PptList, ppt_list } from '../ppts/ppts';
import { NftDetails, nft_details } from '../nfts/nfts';
import { PptDetails, ppt_details } from '../ppts/ppts';
import { NftSenderStatus } from '../nfts/nfts';
import { PptClaimerStatus } from '../ppts/ppts';
import { NftMatrix, nft_matrix } from '../nfts/nfts';
import { PptMatrix, ppt_matrix } from '../ppts/ppts';
import { NftMinter, nft_minter } from '../nfts/nfts';
import { PptMinter, ppt_minter } from '../ppts/ppts';
import { NftMinterApproval } from '../nfts/nfts';
import { PptMinterApproval } from '../ppts/ppts';
import { NftMinterList } from '../nfts/nfts';
import { PptMinterList } from '../ppts/ppts';
import { NftMinterStatus } from '../nfts/nfts';
import { PptMinterStatus } from '../ppts/ppts';
import { PptBurnerStatus } from '../ppts/ppts';
import { UiAbout } from '../about/about';
import { Avalanche } from '../../public/images/tsx';

export const MAX_UINT256 = 2n ** 256n - 1n;
export const MID_UINT256 = 2n ** 255n - 1n;

import { Transaction } from 'ethers';
import './spa-home';
import './spa-nfts';
import './spa-ppts';

type Props = {
    page: Page;
    token: Token;
    speed: number;
}
type State = {
    mining: {
        speed: number;
        speedable: boolean;
        status: MinerStatus | null;
        togglable: boolean;
    };
    minting: {
        rows: MinterRow[];
    };
    nfts: {
        details: Record<NftToken, NftDetails>;
        matrix: NftMatrix;
        minter: Record<NftToken, NftMinter>;
        list: NftList;
    };
    ppts: {
        details: Record<NftToken, PptDetails>;
        matrix: PptMatrix;
        minter: Record<NftToken, PptMinter>;
        list: NftList;
    };
    toggled: boolean;
    token: Token;
    page: Page;
}
function get_nft_details() {
    const entries = Object.fromEntries(
        Array.from(NftTokens()).map((t) => [t, nft_details()])
    );
    return entries as Record<NftToken, NftDetails>;
}
function get_ppt_details() {
    const entries = Object.fromEntries(
        Array.from(NftTokens()).map((t) => [t, ppt_details()])
    );
    return entries as Record<NftToken, PptDetails>;
}
function get_nft_minter() {
    const entries = Object.fromEntries(
        Array.from(NftTokens()).map((t) => [t, nft_minter()])
    );
    return entries as Record<NftToken, NftMinter>;
}
function get_ppt_minter() {
    const entries = Object.fromEntries(
        Array.from(NftTokens()).map((t) => [t, ppt_minter()])
    );
    return entries as Record<NftToken, PptMinter>;
}
function get_nft_matrix() {
    const entries = Object.fromEntries(
        Array.from(NftTokens()).map((t) => [t, nft_matrix()])
    );
    return entries as NftMatrix;
}
function get_ppt_matrix() {
    const entries = Object.fromEntries(
        Array.from(NftTokens()).map((t) => [t, ppt_matrix()])
    );
    return entries as PptMatrix;
}
function get_nft_list() {
    return nft_list() as NftList;
}
function get_ppt_list() {
    return ppt_list() as PptList;
}
export class SPA extends Referable(Updatable(
    React.Component<Props, State>
))  {
    constructor(props: Props) {
        super(props);
        this.state = {
            mining: {
                status: null, togglable: true,
                speed: props.speed, speedable: true,
            },
            minting: {
                rows: Minting.rows(App.level.min),
            },
            nfts: {
                details: get_nft_details(),
                matrix: get_nft_matrix(),
                minter: get_nft_minter(),
                list: get_nft_list(),
            },
            ppts: {
                details: get_ppt_details(),
                matrix: get_ppt_matrix(),
                minter: get_ppt_minter(),
                list: get_ppt_list(),
            },
            toggled: false,
            token: props.token,
            page: props.page,
        };
    }
    async componentDidMount() {
        App.onPageSwitch((page) => this.setState({
            page
        }));
        App.onTokenSwitch((token) => this.update({
            token, minting: { rows: Minting.rows(App.level.min) }
        }));
        /**
         * mining:
         */
        Blockchain.onConnect(async ({ address, token }) => {
            const miner = MiningManager.miner(address, {
                token
            });
            if (miner.running) {
                await this.update({
                    mining: {
                        speed: miner.speed,
                        togglable: miner.speed > 0,
                    }
                });
            } else {
                await this.update({
                    mining: {
                        speed: miner.speed,
                        status: MinerStatus.stopped,
                        togglable: miner.speed > 0,
                    }
                });
            }
        });
        Blockchain.onceConnect(({
            address, token
        }) => {
            const miner = MiningManager.miner(address, {
                token
            });
            miner.on('initializing', () => {
                this.update({
                    mining: { status: MinerStatus.initializing }
                });
            });
            miner.on('initialized', () => {
                this.update({
                    mining: { status: MinerStatus.initialized }
                });
            });
            miner.on('starting', () => {
                this.update({
                    mining: { status: MinerStatus.starting, speedable: false }
                });
            });
            miner.on('started', () => {
                this.update({
                    mining: { status: MinerStatus.started }
                });
            });
            miner.on('stopping', () => {
                this.update({
                    mining: { status: MinerStatus.stopping }
                });
            });
            miner.on('stopped', () => {
                this.update({
                    mining: { status: MinerStatus.stopped, speedable: true }
                });
            });
            miner.on('pausing', () => {
                this.update({
                    mining: { status: MinerStatus.pausing }
                });
            });
            miner.on('paused', () => {
                this.update({
                    mining: { status: MinerStatus.paused }
                });
            });
            miner.on('resuming', () => {
                this.update({
                    mining: { status: MinerStatus.resuming }
                });
            });
            miner.on('resumed', () => {
                this.update({
                    mining: { status: MinerStatus.resumed }
                });
            });
            miner.on('increased', (ev) => {
                this.update({
                    mining: {
                        togglable: ev.speed > 0, speed: ev.speed
                    }
                });
            });
            miner.on('decreased', (ev) => {
                this.update({
                    mining: {
                        togglable: ev.speed > 0, speed: ev.speed
                    }
                });
            });
        }, {
            per: () => App.token
        });
        /**
         * minting:
         */
        App.onNonceChanged(async (
            nonce, { address, amount, token }, total
        ) => {
            if (address !== await Blockchain.selectedAddress) {
                return;
            }
            if (token !== this.state.token) {
                return;
            }
            const amount_min = Tokenizer.amount(
                token, App.level.min
            );
            const level = Tokenizer.level(token, amount);
            const { tx_counter } = Minting.getRow(
                this.state.minting.rows, level - 1
            );
            const row = {
                disabled: !total,
                display: amount === amount_min || total > 0n || tx_counter > 0n,
                nn_counter: Number(total / amount),
            };
            const rows = Minting.setRow(
                this.state.minting.rows, level - 1, row
            );
            await this.update({
                minting: { rows }
            });
        });
        /**
         * nfts:
         */
        App.onTokenChanged(buffered((
            token: Token, { amount: balance }: { amount: Amount }
        ) => {
            this.update({
                ...nft_amounts(token, balance)
            });
        }));
        const nft_amounts = (
            token: Token, balance: Balance
        ) => {
            const nft_token = Nft.token(token);
            const entries = Array.from(NftLevels()).map((nft_level): [
                NftLevel, NftMatrix[NftToken][NftLevel]
            ] => {
                const remainder = balance % 10n ** (BigInt(nft_level) + 3n);
                const amount = remainder / 10n ** BigInt(nft_level);
                return [nft_level, {
                    amount, max: amount, min: 0n
                }];
            });
            return {
                nfts: {
                    matrix: Object.assign(get_nft_matrix(), {
                        [nft_token]: Object.fromEntries(entries)
                    })
                }
            };
        };
        /**
         * ppts:
         */
        App.onNftChanged(buffered(() => {
            const nft_token = Nft.token(this.state.token);
            this.update({
                ...ppt_amounts(nft_token)
            });
        }));
        App.onPptChanged(buffered(() => {
            const nft_token = Nft.token(this.state.token);
            this.update({
                ...ppt_amounts(nft_token)
            });
        }));
        const ppt_amounts = (
            ppt_token: NftToken
        ) => {
            const entries = Array.from(NftLevels()).map((nft_level): [
                NftLevel, PptMatrix[NftToken][NftLevel]
            ] => {
                const { amount: max } = App.getNftTotalBy({
                    level: nft_level, token: ppt_token
                });
                const { amount: min } = App.getPptTotalBy({
                    level: nft_level, token: ppt_token
                });
                return [nft_level, {
                    amount: max, max, min: -min
                }];
            });
            return {
                ppts: {
                    matrix: Object.assign(get_ppt_matrix(), {
                        [ppt_token]: Object.fromEntries(entries)
                    })
                }
            };
        };
        /**
         * {nft,ppt}-details:
         */
        App.event.on('toggle-level', async ({
            level, flag
        }) => {
            const levels = level !== undefined
                ? [level] : Array.from(NftLevels());
            const list = Object.fromEntries(
                levels.map((l) => [l, { toggled: flag }])
            );
            await this.update({
                nfts: { list },
                ppts: { list },
            });
        });
        App.event.on('toggle-issue', async ({
            level, issue, flag
        }) => {
            const levels = level !== undefined
                ? [level] : Array.from(NftLevels());
            const issues = issue !== undefined
                ? [issue] : Array.from(Years());
            const details = Object.fromEntries(
                Array.from(NftTokens()).map(
                    (t) => [t, Object.fromEntries(
                        levels.map((l) => [
                            l, Object.fromEntries(
                                issues.map((i) => [
                                    i, { toggled: flag }
                                ])
                            )
                        ])
                    )]
                )
            );
            await this.update({
                nfts: { details },
                ppts: { details },
            });
        });
        /**
         * {nft,ppt}-{image,minter}:
         */
        Blockchain.onceConnect(async ({
            address, token
        }) => {
            const images = [];
            for (const level of NftLevels()) {
                for (const issue of Years({ reverse: true })) {
                    images.push(nft_image(level, issue, token));
                    images.push(ppt_image(level, issue, token));
                }
            }
            const details = await Promise.all([
                nft_approval(address, token),
                ppt_approval(address, token),
                ...images
            ]);
            await this.update(details.reduce(
                (lhs, rhs) => $.extend(true, lhs, rhs)
            ));
        }, {
            per: () => App.token
        });
        const nft_image = async (
            level: NftLevel, issue: NftIssue, token: Token
        ) => {
            const nft_token = Nft.token(token);
            const pack = (
                image: Partial<NftDetails[0][0]['image']>
            ) => ({
                nfts: {
                    details: {
                        [nft_token]: {
                            [level]: {
                                [issue]: { image }
                            }
                        }
                    }
                },
            });
            const [url_content, url_market] = await Promise.all([
                await nft_meta({ issue, level, token }).then(
                    ({ image }) => image
                ),
                await nft_href({ issue, level, token }),
            ]);
            return pack({
                url_market: url_market?.toString() ?? null,
                url_content
            });
        }
        const ppt_image = async (
            level: NftLevel, issue: NftIssue, token: Token
        ) => {
            const ppt_token = Nft.token(token);
            const pack = (
                image: Partial<PptDetails[0][0]['image']>
            ) => ({
                ppts: {
                    details: {
                        [ppt_token]: {
                            [level]: {
                                [issue]: { image }
                            }
                        }
                    }
                },
            });
            const [url_content, url_market] = await Promise.all([
                await ppt_meta({ issue, level, token }).then(
                    ({ image }) => image
                ),
                await ppt_href({ issue, level, token }),
            ]);
            return pack({
                url_market: url_market?.toString() ?? null,
                url_content
            });
        }
        const nft_approval = async (
            address: Address, token: Token
        ) => {
            const moe_wallet = new MoeWallet(address, token);
            const nft_wallet = new NftWallet(address, token);
            const nft_contract = await nft_wallet.contract;
            const allowance = await moe_wallet.allowance(
                address, nft_contract.address
            );
            const approval = allowance > MID_UINT256
                ? NftMinterApproval.approved : null;
            return {
                nfts: {
                    minter: { [Nft.token(token)]: { approval } }
                }
            };
        };
        const ppt_approval = async (
            address: Address, token: Token
        ) => {
            const ppt_treasury = await PptTreasuryFactory({ token });
            const nft_wallet = new NftWallet(address, token);
            const approved = await nft_wallet.isApprovedForAll(
                ppt_treasury.address
            );
            const approval = approved
                ? PptMinterApproval.approved : null;
            return {
                ppts: {
                    minter: { [Nft.token(token)]: { approval } }
                }
            };
        };
        /**
         * fallback: if no chain is installed
         */
        Blockchain.isInstalled().then(async (installed) => {
            const get_images = async (token: Token) => {
                const images = [];
                for (const level of NftLevels()) {
                    for (const issue of Years({ reverse: true })) {
                        images.push(nft_image(level, issue, token));
                        images.push(ppt_image(level, issue, token));
                    }
                }
                const details = await Promise.all([
                    ...images
                ]);
                await this.update(details.reduce(
                    (lhs, rhs) => $.extend(true, lhs, rhs)
                ));
            };
            if (!installed) {
                App.onTokenSwitch(get_images);
                get_images(this.state.token);
            }
        });
    }
    render() {
        if (App.debug) {
            console.count('[app.render]');
        }
        const { page, token } = this.state;
        const { nfts, ppts } = this.state;
        const { toggled } = this.state;
        const { speed } = this.props;
        return <React.StrictMode>
            {this.$h1(page)}
            {this.$connector(page)}
            {this.$wallet(page, token)}
            {this.$selector(page, token)}
            {this.$home(page, token, speed)}
            {this.$nfts(page, token, nfts.list, toggled)}
            {this.$ppts(page, token, ppts.list, toggled)}
            {this.$about(page, token)}
        </React.StrictMode>;
    }
    $h1(
        page: Page
    ) {
        if (page === Page.Home) {
            return <h1>Mine & Mint Proof-of-Work Tokens on Avalanche <Avalanche /></h1>;
        }
        if (page === Page.Nfts) {
            return <h1>Mint stakeable XPower NFTs on Avalanche <Avalanche /></h1>;
        }
        if (page === Page.Ppts) {
            return <h1>Stake minted XPower NFTs on Avalanche <Avalanche /></h1>;
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
        const { mining, minting } = this.state;
        return <form id='home'
            onSubmit={(e) => e.preventDefault()}
        >
            <UiHome
                mining={{
                    onToggle: this.toggle.bind(this),
                    onSpeed: this.speed.bind(this),
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
        page: Page, token: Token, list: NftList, toggled: boolean
    ) {
        if (page !== Page.Nfts) {
            return null;
        }
        const nft_token = Nft.token(token);
        return <form id='nfts'
            onSubmit={(e) => e.preventDefault()}
        >
            <UiNfts
                details={this.state.nfts.details}
                matrix={this.state.nfts.matrix}
                minter={this.state.nfts.minter}
                list={list}
                onNftList={(lhs, rhs) => {
                    this.update({
                        nfts: { list: lhs, matrix: { [nft_token]: rhs } },
                        ppts: { list: lhs }
                    })
                }}
                onNftImageLoaded={(
                    nft_issue, nft_level
                ) => {
                    this.update({
                        nfts: {
                            details: {
                                [nft_token]: {
                                    [nft_level]: {
                                        [nft_issue]: {
                                            image: { loading: false }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }}
                onNftSenderExpanded={(
                    nft_issues, nft_level, toggled
                ) => {
                    this.update({
                        nfts: {
                            details: {
                                [nft_token]: {
                                    [nft_level]: Object.fromEntries(
                                        nft_issues.map((issue) => [issue, {
                                            toggled
                                        }])
                                    )
                                }
                            }
                        }
                    });
                }}
                onNftAmountChanged={(
                    nft_issue, nft_level, value, valid
                ) => {
                    this.update({
                        nfts: {
                            details: {
                                [nft_token]: {
                                    [nft_level]: {
                                        [nft_issue]: {
                                            amount: { valid, value }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }}
                onNftTargetChanged={(
                    nft_issue, nft_level, value, valid
                ) => {
                    this.update({
                        nfts: {
                            details: {
                                [nft_token]: {
                                    [nft_level]: {
                                        [nft_issue]: {
                                            target: { valid, value }
                                        }
                                    }
                                }
                            }
                        }
                    });
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
                onNftMinterList={(lhs, rhs) => {
                    this.update({
                        nfts: { list: lhs, matrix: { [nft_token]: rhs } }
                    });
                }}
                onNftMinterToggled={(toggled, ctrlKey) => {
                    if (!ctrlKey) {
                        return this.update({ toggled });
                    }
                    const list = Object.fromEntries(
                        Array.from(NftLevels()).map(
                            (nft_level) => [nft_level, { toggled }]
                        )
                    );
                    this.update({
                        nfts: { list },
                        ppts: { list },
                        toggled
                    });
                }}
                toggled={toggled}
                token={token}
            />
        </form>;
    }
    $ppts(
        page: Page, token: Token, list: NftList, toggled: boolean
    ) {
        if (page !== Page.Ppts) {
            return null;
        }
        const nft_token = Nft.token(token);
        return <form id='nfts'
            onSubmit={(e) => e.preventDefault()}
        >
            <UiPpts
                details={this.state.ppts.details}
                matrix={this.state.ppts.matrix}
                minter={this.state.ppts.minter}
                list={list}
                onPptList={(lhs, rhs) => {
                    this.update({
                        nfts: { list: lhs },
                        ppts: { list: lhs, matrix: { [nft_token]: rhs } }
                    })
                }}
                onPptImageLoaded={(
                    ppt_issue, ppt_level
                ) => {
                    this.update({
                        ppts: {
                            details: {
                                [nft_token]: {
                                    [ppt_level]: {
                                        [ppt_issue]: {
                                            image: { loading: false }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }}
                onPptClaimerExpanded={(
                    ppt_issues, ppt_level, toggled
                ) => {
                    this.update({
                        ppts: {
                            details: {
                                [nft_token]: {
                                    [ppt_level]: Object.fromEntries(
                                        ppt_issues.map((issue) => [issue, {
                                            toggled
                                        }])
                                    )
                                }
                            }
                        }
                    });
                }}
                onPptAmountChanged={(
                    nft_issue, nft_level, value, valid
                ) => {
                    this.update({
                        ppts: {
                            details: {
                                [nft_token]: {
                                    [nft_level]: {
                                        [nft_issue]: {
                                            amount: { valid, value }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }}
                onPptTargetChanged={(
                    nft_issue, nft_level, value, valid
                ) => {
                    this.update({
                        ppts: {
                            details: {
                                [nft_token]: {
                                    [nft_level]: {
                                        [nft_issue]: {
                                            target: { valid, value }
                                        }
                                    }
                                }
                            }
                        }
                    });
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
                onPptMinterList={(lhs, rhs) => {
                    this.update({
                        ppts: { list: lhs, matrix: { [nft_token]: rhs } }
                    });
                }}
                onPptMinterToggled={(toggled, ctrlKey) => {
                    if (!ctrlKey) {
                        return this.update({ toggled });
                    }
                    const list = Object.fromEntries(
                        Array.from(NftLevels()).map(
                            (nft_level) => [nft_level, { toggled }]
                        )
                    );
                    this.update({
                        nfts: { list },
                        ppts: { list },
                        toggled
                    });
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
                if (token !== this.state.token) {
                    return;
                }
                const { tx_counter } = Minting.getRow(
                    this.state.minting.rows, level - 1
                );
                if (tx_counter > 0) {
                    const rows = Minting.setRow(
                        this.state.minting.rows, level - 1, {
                        tx_counter: tx_counter - 1
                    });
                    this.update({
                        minting: { rows }
                    });
                }
            };
            await this.update({
                minting: {
                    rows: Minting.setRow(
                        this.state.minting.rows, level - 1, {
                        status: MinterStatus.minting,
                    })
                }
            });
            const mint = await moe_wallet.mint(
                block_hash, nonce
            );
            console.debug('[mint]', mint);
            moe_wallet.onTransfer(on_transfer);
            const { tx_counter } = Minting.getRow(
                this.state.minting.rows, level - 1
            );
            await this.update({
                minting: {
                    rows: Minting.setRow(
                        this.state.minting.rows, level - 1, {
                        status: MinterStatus.minted,
                        tx_counter: tx_counter + 1
                    })
                }
            });
            App.removeNonce(nonce, {
                address, block_hash, token
            });
        } catch (ex: any) {
            this.update({
                minting: {
                    rows: Minting.setRow(
                        this.state.minting.rows, level - 1, {
                        status: MinterStatus.error
                    })
                }
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
            const $mint = this.global_ref<HTMLElement>(
                `.mint[level=${level}]`
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
            this.state.token
        );
        const core_id = Nft.coreId({
            issue: nft_issue, level: nft_level
        });
        const by_token = this.state.nfts.details[nft_token];
        const by_level = by_token[nft_level];
        const by_issue = by_level[nft_issue];
        const target = by_issue.target.value as Address;
        const amount = by_issue.amount.value as Amount;
        const nft_wallet = new NftWallet(
            address, this.state.token
        );
        const on_single_tx: OnTransferSingle = async (
            op, from, to, id, value, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            this.update({
                nfts: {
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
                }
            });
        };
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.update({
                nfts: {
                    details: {
                        [nft_token]: {
                            [nft_level]: {
                                [nft_issue]: {
                                    sender: { status: NftSenderStatus.sending }
                                }
                            }
                        }
                    }
                }
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
                const $ref = this.global_ref<HTMLElement>(
                    `nft-sender:${core_id}`
                );
                const $sender_row = ancestor(
                    $ref.current, (e) => e.classList.contains('row')
                );
                alert(ex.message, Alert.warning, {
                    style: { margin: '0.5em 0 -0.5em 0' },
                    after: $sender_row
                });
            }
            this.update({
                nfts: {
                    details: {
                        [nft_token]: {
                            [nft_level]: {
                                [nft_issue]: {
                                    sender: { status: NftSenderStatus.error }
                                }
                            }
                        }
                    }
                }
            });
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
            this.update({
                nfts: {
                    minter: {
                        [Nft.token(token)]: {
                            approval: NftMinterApproval.approved
                        }
                    }
                }
            });
        };
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.update({
                nfts: {
                    minter: {
                        [Nft.token(token)]: {
                            approval: NftMinterApproval.approving
                        }
                    }
                }
            });
            moe_wallet.onApproval(on_approval);
            const nft_contract = await nft_wallet.contract;
            tx = await moe_wallet.increaseAllowance(
                nft_contract.address, MAX_UINT256 - old_allowance
            );
        } catch (ex) {
            this.update({
                nfts: {
                    minter: {
                        [Nft.token(token)]: {
                            approval: NftMinterApproval.error
                        }
                    }
                }
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
            this.update({
                nfts: {
                    minter: {
                        [Nft.token(token)]: {
                            status: NftMinterStatus.minted
                        }
                    }
                }
            });
        };
        const nft_wallet = new NftWallet(address, App.token);
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.update({
                nfts: {
                    minter: {
                        [Nft.token(token)]: {
                            status: NftMinterStatus.minting
                        }
                    }
                }
            });
            nft_wallet.onTransferBatch(on_batch_tx);
            tx = await nft_wallet.mintBatch(levels, amounts);
        } catch (ex) {
            this.update({
                nfts: {
                    minter: {
                        [Nft.token(token)]: {
                            status: NftMinterStatus.error
                        }
                    }
                }
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
            this.state.token
        );
        const core_id = Nft.coreId({
            issue: ppt_issue, level: ppt_level
        });
        const moe_treasury = MoeTreasuryFactory({
            token: this.state.token
        });
        const on_claim_tx: OnClaim = async (
            acc, id, amount, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            this.update({
                ppts: {
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
                }
            });
        };
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.update({
                ppts: {
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
                }
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
            this.update({
                ppts: {
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
                }
            });
            const $ref = this.global_ref<HTMLElement>(
                `ppt-claimer:${core_id}`
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
            this.update({
                ppts: {
                    minter: {
                        [Nft.token(token)]: {
                            approval: PptMinterApproval.approved
                        }
                    }
                }
            });
        } else {
            const on_approval: OnApprovalForAll = (
                account, op, flag, ev
            ) => {
                if (ev.transactionHash !== tx?.hash) {
                    return;
                }
                this.update({
                    ppts: {
                        minter: {
                            [Nft.token(token)]: {
                                approval: PptMinterApproval.approved
                            }
                        }
                    }
                });
            };
            let tx: Transaction | undefined;
            Alerts.hide();
            try {
                this.update({
                    ppts: {
                        minter: {
                            [Nft.token(token)]: {
                                approval: PptMinterApproval.approving
                            }
                        }
                    }
                });
                nft_wallet.onApprovalForAll(on_approval);
                tx = await nft_wallet.setApprovalForAll(
                    await ppt_treasury.then((c) => c.address), true
                );
            } catch (ex) {
                this.update({
                    ppts: {
                        minter: {
                            [Nft.token(token)]: {
                                approval: PptMinterApproval.error
                            }
                        }
                    }
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
            this.update({
                ppts: {
                    minter: {
                        [Nft.token(token)]: {
                            minter_status: PptMinterStatus.minted
                        }
                    }
                }
            });
        };
        const ppt_treasury = PptTreasuryFactory({
            token
        });
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.update({
                ppts: {
                    minter: {
                        [Nft.token(token)]: {
                            minter_status: PptMinterStatus.minting
                        }
                    }
                }
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
            this.update({
                ppts: {
                    minter: {
                        [Nft.token(token)]: {
                            minter_status: PptMinterStatus.error
                        }
                    }
                }
            });
            const $ref = this.global_ref<HTMLElement>(
                'ppt-batch-minter'
            );
            this.error(ex, { after: $ref.current });
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
            this.update({
                ppts: {
                    minter: {
                        [Nft.token(token)]: {
                            burner_status: PptBurnerStatus.burned
                        }
                    }
                }
            });
        };
        const ppt_treasury = PptTreasuryFactory({
            token
        });
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.update({
                ppts: {
                    minter: {
                        [Nft.token(token)]: {
                            burner_status: PptBurnerStatus.burning
                        }
                    }
                }
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
            this.update({
                ppts: {
                    minter: {
                        [Nft.token(token)]: {
                            burner_status: PptBurnerStatus.error
                        }
                    }
                }
            });
            const $ref = this.global_ref<HTMLElement>(
                'ppt-batch-minter'
            );
            this.error(ex, { after: $ref.current });
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
    const $content = document.querySelector('content');
    createRoot($content!).render(createElement(SPA, {
        page: App.page, token: App.token, speed: App.speed
    }));
}
export default SPA;
