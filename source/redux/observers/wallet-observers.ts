/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { Action } from '../actions';
import { Amount, Empty, State, Supply, Token, Wallet } from '../types';

export type OnWalletIncreased = (
    token: Token, item: { amount: Amount, supply: Supply }
) => void;
export type OnWalletDecreased = (
    token: Token, item: { amount: Amount, supply: Supply }
) => void;

export function onWalletIncreased(
    store: Store<State, Action>, handler: OnWalletIncreased
): Unsubscribe {
    const selector = (state: State) => state.wallet;
    const observer = observe<Wallet>(store)(
        selector, Empty<Wallet>()
    );
    return observer((next) => {
        const added = (token: Token) => {
            const item = next.items[token];
            if (item) handler(token, item);
        };
        if (next.more) {
            next.more.forEach(added);
        }
    });
}
export function onWalledDecreased(
    store: Store<State, Action>, handler: OnWalletDecreased
): Unsubscribe {
    const selector = (state: State) => state.wallet;
    const observer = observe<Wallet>(store)(
        selector, Empty<Wallet>()
    );
    return observer((next) => {
        const removed = (token: Token) => {
            const item = next.items[token];
            if (item) handler(token, item);
        };
        if (next.less) {
            next.less.forEach(removed);
        }
    });
}
