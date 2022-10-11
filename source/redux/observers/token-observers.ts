import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { delayed } from '../../functions';
import { RWParams } from '../../params';
import { AppState } from '../store';
import { Token } from '../types';

export type OnTokenSwitch = (
    next: Token, prev: Token
) => void;

export function onTokenSwitch(
    store: Store<AppState, AnyAction>,
    handler: OnTokenSwitch, ms = 0
): Unsubscribe {
    const selector = (state: AppState) => state.token;
    const observer = observe<Token>(store)(
        selector, RWParams.token
    );
    return observer(delayed(handler, ms));
}
export function onTokenSwitched(
    store: Store<AppState, AnyAction>,
    handler: OnTokenSwitch, ms = 600
): Unsubscribe {
    return onTokenSwitch(store, handler, ms);
}
