import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { Address, Amount, Nonce, Nonces, State } from '../types';
import { Action } from '../actions';

enum Sign {
    positive = +1,
    negative = -1
}
const TOTAL = {} as {
    [address: Address]: number;
};
const inc_total = (sign: Sign, { address, amount }: {
    address: Address, amount: Amount
}) => {
    if (TOTAL[address] === undefined) {
        TOTAL[address] = 0;
    }
    return Math.max(0, TOTAL[address] += amount * sign);
};
const TOTAL_BY = {} as {
    [address: Address]: { [amount: Amount]: number; }
};
const inc_total_by = (sign: Sign, { address, amount }: {
    address: Address, amount: Amount
}) => {
    if (TOTAL_BY[address] === undefined) {
        TOTAL_BY[address] = {};
    }
    if (TOTAL_BY[address][amount] === undefined) {
        TOTAL_BY[address][amount] = 0;
    }
    return Math.max(0, TOTAL_BY[address][amount] += amount * sign);
};

export type OnNonceAdded = (
    nonce: Nonce, item: { address: Address, amount: Amount },
    total_by: Amount, total: Amount
) => void;
export type OnNonceRemoved = (
    nonce: Nonce, item: { address: Address, amount: Amount },
    total_by: Amount, total: Amount
) => void;

export function onNonceAdded(
    store: Store<State, Action>, handler: OnNonceAdded
): Unsubscribe {
    const selector = (state: State) => state.nonces;
    const observer = observe<Nonces>(store)(selector, {
        items: {}
    });
    return observer((next) => {
        const added = (n: Nonce) => {
            const total_by = inc_total_by(Sign.positive, next.items[n]);
            const total = inc_total(Sign.positive, next.items[n]);
            handler(n, next.items[n], total_by, total);
        };
        if (next.more) {
            next.more.forEach(added);
        } else if (!next.less) {
            Object.keys(next.items).forEach(added); // restore on:load
        }
    });
}
export function onNonceRemoved(
    store: Store<State, Action>, handler: OnNonceRemoved
): Unsubscribe {
    const selector = (state: State) => state.nonces;
    const observer = observe<Nonces>(store)(selector, {
        items: {}
    });
    return observer((next, prev) => {
        const removed = (p: Nonce) => {
            const total_by = inc_total_by(Sign.negative, prev.items[p]);
            const total = inc_total(Sign.negative, prev.items[p]);
            handler(p, prev.items[p], total_by, total);
        };
        if (next.less) {
            next.less.forEach(removed);
        }
    });
}
