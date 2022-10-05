import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { Params } from '../../params';
import { State, Token } from '../types';

export type OnTokenSwitch = (
    next: Token, prev: Token
) => void;

export function onTokenSwitch(
    store: Store<State, AnyAction>, handler: OnTokenSwitch
): Unsubscribe {
    const selector = (state: State) => state.token;
    const observer = observe<Token>(store)(
        selector, Params.token
    );
    return observer(handler);
}
