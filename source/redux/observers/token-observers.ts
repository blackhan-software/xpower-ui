import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { State, Token } from '../types';
import { App } from '../../app';

export type OnTokenSwitch = (
    next: Token, prev: Token
) => void;

export function onTokenSwitch(
    store: Store<State, AnyAction>, handler: OnTokenSwitch
): Unsubscribe {
    const selector = (state: State) => state.token;
    const observer = observe<Token>(store)(
        selector, App.token
    );
    return observer(handler);
}
