import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { Params } from '../../params';
import { AppState } from '../store';
import { Token } from '../types';

export type OnTokenSwitch = (
    next: Token, prev: Token
) => void;

export function onTokenSwitch(
    store: Store<AppState, AnyAction>, handler: OnTokenSwitch
): Unsubscribe {
    const selector = (state: AppState) => state.token;
    const observer = observe<Token>(store)(
        selector, Params.token
    );
    return observer(handler);
}
