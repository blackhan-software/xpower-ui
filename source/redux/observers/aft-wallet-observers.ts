/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { Action } from '../actions';
import { Amount, Empty, State, Supply, Token, AftWallet } from '../types';

export type OnAftWalletIncreased = (
    token: Token, item: { amount: Amount, supply: Supply }
) => void;
export type OnAftWalletDecreased = (
    token: Token, item: { amount: Amount, supply: Supply }
) => void;

export function onAftWalletIncreased(
    store: Store<State, Action>, handler: OnAftWalletIncreased
): Unsubscribe {
    const selector = (state: State) => state.aft_wallet;
    const observer = observe<AftWallet>(store)(
        selector, Empty<AftWallet>()
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
export function onAftWalletDecreased(
    store: Store<State, Action>, handler: OnAftWalletDecreased
): Unsubscribe {
    const selector = (state: State) => state.aft_wallet;
    const observer = observe<AftWallet>(store)(
        selector, Empty<AftWallet>()
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
