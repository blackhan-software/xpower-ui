import './spa.scss';

import { App } from '../../source/app';
import { Page, Token } from '../../source/redux/types';
import { NftLevel, NftLevels } from '../../source/redux/types';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Connector } from '../connector/connector';
import { WalletUi } from '../wallet/wallet-ui';
import { Selector } from '../selector/selector';
import { Home } from '../home/home';
import { UiNfts } from '../nfts/nfts';
import { UiPpts } from '../staking/staking';
import { About } from '../about/about';
import { Avalanche } from '../../public/images/tsx';
import { update } from '../../source/functions';

type Props = {
    page: Page; token: Token; speed: number;
}
type State = {
    page: Page; token: Token; list: List;
}
type List = Record<NftLevel, {
    display: boolean;
    toggled: boolean;
}>
function list(
    display = false, toggled = false
) {
    const entries = Object.fromEntries(
        Array.from(NftLevels()).map(
            (nft_level) => [nft_level, {
                display, toggled
            }]
        )
    );
    return entries as List;
}
export class SPA extends React.Component<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            page: props.page,
            token: props.token,
            list: list()
        };
        this.events();
    }
    events() {
        App.onPageSwitch((page) => this.setState({
            page
        }));
        App.onTokenSwitch((token) => this.setState({
            token
        }));
    }
    render() {
        const { list, page, token } = this.state;
        const { speed } = this.props;
        return <React.Fragment>
            {this.$h1(page)}
            {this.$connector(page)}
            {this.$wallet(page, token)}
            {this.$selector(page, token)}
            {this.$home(page, token, speed)}
            {this.$nfts(page, token, list)}
            {this.$ppts(page, token, list)}
            {this.$about(page, token)}
        </React.Fragment>;
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
        if (page === Page.Staking) {
            return <h1>Stake minted XPower NFTs on Avalanche <Avalanche /></h1>;
        }
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
        return <form id='home'
            className={page !== Page.Home ? 'd-none' : ''}
            onSubmit={(e) => e.preventDefault()}
        >
            <Home token={token} speed={speed} />
        </form>;
    }
    $nfts(
        page: Page, token: Token, list: List
    ) {
        return <form id='nfts'
            className={page !== Page.Nfts ? 'd-none' : ''}
            onSubmit={(e) => e.preventDefault()}
        >
            <UiNfts token={token} list={list} onList={(list) => {
                update<State>.bind(this)({ list })
            }}/>
        </form>;
    }
    $ppts(
        page: Page, token: Token, list: List
    ) {
        return <form id='ppts'
            className={page !== Page.Staking ? 'd-none' : ''}
            onSubmit={(e) => e.preventDefault()}
        >
            <UiPpts token={token} list={list} onList={(list) => {
                update<State>.bind(this)({ list })
            }}/>
        </form>;
    }
    $about(
        page: Page, token: Token
    ) {
        if (page === Page.About) {
            return <form id='about'
                onSubmit={(e) => e.preventDefault()}
            >
                <About token={token} />
            </form>;
        }
        return null;
    }
}
if (require.main === module) {
    const $content = document.querySelector('content');
    createRoot($content!).render(createElement(SPA, {
        page: App.page, token: App.token, speed: App.speed
    }));
}
export default SPA;
