import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { hex, max, x40 } from '../../functions';
import { AppState } from '../store';
import { Account, Amount, BlockHash, Empty, Nonce, Nonces } from '../types';

enum Sign {
    positive = +1,
    negative = -1
}
const TOTAL = {} as {
    [address: string]: bigint
};
const inc_total = (sign: Sign, { account, amount }: {
    account: Account, amount: Amount
}) => {
    const x_address = x40(account);
    if (TOTAL[x_address] === undefined) {
        TOTAL[x_address] = 0n;
    }
    if (sign > 0) {
        return max(0n, TOTAL[x_address] += amount);
    } else {
        return max(0n, TOTAL[x_address] -= amount);
    }
};
const TOTAL_BY = {} as {
    [address: string]: { [amount: string]: bigint; }
};
const inc_total_by = (sign: Sign, { account, amount }: {
    account: Account, amount: Amount
}) => {
    const x_address = x40(account);
    if (TOTAL_BY[x_address] === undefined) {
        TOTAL_BY[x_address] = {};
    }
    const x_amount = hex(amount);
    if (TOTAL_BY[x_address][x_amount] === undefined) {
        TOTAL_BY[x_address][x_amount] = 0n;
    }
    if (sign > 0) {
        return max(0n, TOTAL_BY[x_address][x_amount] += amount);
    } else {
        return max(0n, TOTAL_BY[x_address][x_amount] -= amount);
    }
};

export type OnNonceAdded = (
    nonce: Nonce, item: {
        account: Account,
        amount: Amount,
        block_hash: BlockHash,
    },
    total_by: Amount, total: Amount
) => void;
export type OnNonceRemoved = (
    nonce: Nonce, item: {
        account: Account,
        amount: Amount,
        block_hash: BlockHash,
    },
    total_by: Amount, total: Amount
) => void;
export type OnNonceChanged
    = OnNonceAdded | OnNonceRemoved;

export function onNonceAdded(
    store: Store<AppState, AnyAction>,
    handler: OnNonceAdded
): Unsubscribe {
    const selector = (state: AppState) => state.nonces;
    const observer = observe<Nonces>(store)(
        selector, Empty<Nonces>()
    );
    return observer((next) => {
        const added = (n: Nonce) => {
            const item = next.items[n];
            if (item) {
                const total_by = inc_total_by(Sign.positive, item);
                const total = inc_total(Sign.positive, item);
                handler(n, item, total_by, total);
            }
        };
        if (next.more) {
            next.more.forEach(added);
        } else if (!next.less) {
            const nonces = Object.keys(next.items);
            nonces.forEach(added); // restore on:load
        }
    });
}
export function onNonceRemoved(
    store: Store<AppState, AnyAction>,
    handler: OnNonceRemoved
): Unsubscribe {
    const selector = (state: AppState) => state.nonces;
    const observer = observe<Nonces>(store)(
        selector, Empty<Nonces>()
    );
    return observer((next, prev) => {
        const removed = (p: Nonce) => {
            const item = prev.items[p];
            if (item) {
                const total_by = inc_total_by(Sign.negative, item);
                const total = inc_total(Sign.negative, item);
                handler(p, item, total_by, total);
            }
        };
        if (next.less) {
            next.less.forEach(removed);
        }
    });
}
export function onNonceChanged(
    store: Store<AppState, AnyAction>,
    handler: OnNonceChanged
): Unsubscribe {
    const un_add = onNonceAdded(store, handler);
    const un_rem = onNonceRemoved(store, handler);
    return () => { un_add(); un_rem(); };
}
export default onNonceChanged;
