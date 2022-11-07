import './selector.scss';

import { switchToken } from '../../source/redux/actions';
import { onTokenSwitch, onTokenSwitched } from '../../source/redux/observers';
import { AppDispatch, AppState } from '../../source/redux/store';
import { Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

import React, { MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useStore } from 'react-redux';

type Props = {
    token: Token;
}
type State = {
    switching: boolean;
}
export function UiSelector(
    { token }: Props
) {
    const store = useStore<AppState>();
    const dispatch = useDispatch();
    useEffect(() => onTokenSwitch(
        store, () => set_switching(true)), [store]
    );
    useEffect(() => onTokenSwitched(
        store, () => set_switching(false)), [store]
    );
    const [switching, set_switching]
        = useState<State['switching']>(false);
    return <div
        className='btn-group selectors' role='group'
    >
        {$anchor(Token.THOR, token, switching, dispatch)}
        {$anchor(Token.LOKI, token, switching, dispatch)}
        {$anchor(Token.ODIN, token, switching, dispatch)}
    </div>;
}
function $anchor(
    xtoken_my: Token, token: Token,
    switching: boolean, dispatch: AppDispatch
) {
    const xtoken = Tokenizer.xify(token);
    const atoken_my = Tokenizer.aify(xtoken_my);
    const token_my = token.startsWith('a') ? atoken_my : xtoken_my;
    const selector = `selector-${Tokenizer.lower(xtoken_my)}`;
    const active = xtoken === xtoken_my ? 'active' : '';
    const disabled = switching ? 'pseudo-disabled' : '';
    const classes = [
        'btn btn-outline-warning', selector, active, disabled
    ];
    return <a type='button'
        className={classes.join(' ')}
        data-bs-toggle='tooltip'
        data-bs-placement='top'
        data-bs-fixed='true'
        href={`?token=${token_my}`}
        onClick={(e) => switchTo(e, token_my, dispatch)}
    >
        {$spinner(xtoken_my, xtoken, switching)}
        {$image(xtoken_my, xtoken, switching)}
        {$label(xtoken_my)}
    </a>;
}
function switchTo(
    e: MouseEvent<HTMLAnchorElement>,
    my_token: Token, dispatch: AppDispatch
) {
    if (e.ctrlKey === false) {
        e.preventDefault();
    }
    if (e.ctrlKey === false) {
        dispatch(switchToken(my_token));
    }
}
function $spinner(
    my_token: Token, token: Token, switching: boolean
) {
    return Spinner({ show: show(my_token, token, switching) });
}
function $image(
    my_token: Token, token: Token, switching: boolean
) {
    const token_lc = Tokenizer.lower(token);
    const fixed_lc = Tokenizer.lower(my_token);
    const classes = [
        'float-sm-start', hide(my_token, token, switching)
            ? 'd-none' : '', token_lc
    ];
    return <img
        alt={my_token}
        height={24} width={24}
        className={classes.join(' ')}
        src={`/images/svg/${fixed_lc}-black.svg`}
    />;
}
function $label(
    my_token: Token
) {
    return <span className='d-none d-sm-inline'>{my_token}</span>;
}
function show(
    my_token: Token, token: Token, switching: boolean
) {
    const eq = token === my_token;
    return eq && switching;
}
function hide(
    my_token: Token, token: Token, switching: boolean
) {
    const eq = token === my_token;
    return eq && switching;
}
function Spinner(
    state: { show: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-sm-start', !state.show ? 'd-none' : ''
    ];
    return <span
        className={classes.join(' ')} role='status'
    />;
}
export default UiSelector;
