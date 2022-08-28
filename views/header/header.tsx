import './header.scss';

import { App } from '../../source/app';
import { Page, Token } from '../../source/redux/types';

import React, { createElement, MouseEvent } from 'react';
import { createRoot } from 'react-dom/client';

type Props = {
    token: Token, page: Page
}
type State = {
    token: Token, page: Page
}
export class UiHeader extends React.Component<
    Props, State
> {
    constructor(props: {
        token: Token, page: Page,
        onPage?: (page: Page) => void
    }) {
        super(props);
        this.state = {
            ...props
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
        const classes=[
            'nav nav-pills nav-justified', 'mb-3'
        ];
        return <nav id='menu' className={
            classes.join(' ')
        }>
            {this.$anchor(Page.Home)}
            {this.$anchor(Page.Nfts)}
            {this.$anchor(Page.Ppts)}
            {this.$anchor(Page.About)}
        </nav>;
    }
    $anchor(
        page: Page
    ) {
        const active = this.state.page === page
            ? `active ${page}` : page;
        const classes = [
            'btn btn-outline-warning',
            'flex-sm-fill text-sm-center',
            'nav-link', active
        ];
        return <a
            className={classes.join(' ')}
            href={`/${page}?token=${this.state.token}`}
            onClick={(e) => this.onClick(e, page)}
        >
            {this.$icon(page)}
            {this.$label(page)}
        </a>;
    }
    onClick(
        e: MouseEvent, page: Page
    ) {
        if (e.ctrlKey === false) {
            if (Page.None !== this.state.page) {
                e.preventDefault();
            }
            App.switchPage(page);
        }
    }
    $icon(
        page: Page
    ) {
        const classes = [
            'float-sm-start', this.icons[page]
        ];
        return <i className={classes.join(' ')} />;
    }
    $label(
        page: Page
    ) {
        return <span className='d-none d-sm-inline'>
            {this.labels[page]}
        </span>;
    }
    icons: Record<Page, string> = {
        [Page.Home]: 'bi-lightning-charge-fill',
        [Page.Nfts]: 'bi-image-fill',
        [Page.Ppts]: 'bi-cash-stack',
        [Page.About]: 'bi-lightbulb-fill',
        [Page.None]: '',
    }
    labels: Record<Page, string> = {
        [Page.Home]: 'XPower',
        [Page.Nfts]: 'NFTs',
        [Page.Ppts]: 'Staking',
        [Page.About]: 'About',
        [Page.None]: '',
    }
}
if (require.main === module) {
    const $header = document.querySelector('header');
    createRoot($header!).render(createElement(UiHeader, {
        token: App.token, page: App.page
    }));
}
export default UiHeader;
