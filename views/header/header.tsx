import './header.scss';

import { switchPage } from '../../source/redux/actions';
import { AppState, Store } from '../../source/redux/store';
import { Page, Token } from '../../source/redux/types';

import { Dispatch } from '@reduxjs/toolkit';
import React, { createElement, MouseEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { connect, Provider, useDispatch } from 'react-redux';

type Props = {
    page: Page; token: Token;
}
export function UiHeader(
    props: Props
) {
    const classes = [
        'btn-group nav nav-pills nav-justified', 'mb-3'
    ];
    return <React.StrictMode>
        <nav id='menu' className={
            classes.join(' ')
        }>
            {$anchor(Page.Mine, props)}
            {$anchor(Page.Nfts, props)}
            {$anchor(Page.Ppts, props)}
            {$anchor(Page.Swap, props)}
            {$anchor(Page.About, props)}
        </nav>
    </React.StrictMode>;
}
function $anchor(
    my_page: Page, { page, token }: Props
) {
    const dispatch = useDispatch();
    const active = my_page === page
        ? `active ${my_page}` : my_page;
    const classes = [
        'btn btn-outline-warning',
        'flex-sm-fill text-sm-center',
        'nav-link', active
    ];
    return <a
        className={classes.join(' ')}
        href={`/${my_page}?token=${token}`}
        onClick={(e) => onClick(dispatch)(e, my_page, { page })}
    >
        {$icon(my_page)}
        {$label(my_page)}
    </a>;
}
const onClick = (dispatch: Dispatch) => (
    e: MouseEvent, my_page: Page,
    { page }: Pick<Props, 'page'>
) => {
    if (e.ctrlKey === false) {
        if (Page.None !== page) {
            e.preventDefault();
        }
        dispatch(switchPage(my_page));
    }
}
function $icon(
    my_page: Page
) {
    const classes = [
        'float-sm-start', icons[my_page]
    ];
    return <i className={classes.join(' ')} />;
}
function $label(
    my_page: Page,
) {
    return <span className='d-none d-sm-inline text'>
        {labels[my_page]}
    </span>;
}
const icons: Record<Page, string> = {
    [Page.Mine]: 'bi-lightning-charge-fill',
    [Page.Nfts]: 'bi-image-fill',
    [Page.Ppts]: 'bi-cash-stack',
    [Page.Swap]: 'bi-currency-exchange',
    [Page.About]: 'bi-lightbulb-fill',
    [Page.None]: '',
}
const labels: Record<Page, string> = {
    [Page.Mine]: 'Mine',
    [Page.Nfts]: 'NFTs',
    [Page.Ppts]: 'Stake',
    [Page.Swap]: 'Swap',
    [Page.About]: 'About',
    [Page.None]: '',
}
if (require.main === module) {
    const mapper = ({ page, token }: AppState) => ({ page, token });
    const $ui_header = createElement(connect(mapper)(UiHeader));
    const $header = document.querySelector('header');
    createRoot($header!).render(
        <Provider store={Store()}>{$ui_header}</Provider>
    );
}
export default UiHeader;
