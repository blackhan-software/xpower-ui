import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { Nonce, Nonces, State, Empty } from '../types';
import { Address, Amount, BlockHash } from '../types';
import { max, hex_40, hex } from '../../functions';
import { Action } from '../actions';

enum Sign {
    positive = +1,
    negative = -1
}
const TOTAL = {} as {
    [address: string]: bigint;
};
const inc_total = (sign: Sign, { address, amount }: {
    address: Address, amount: Amount
}) => {
    const x_address = hex_40(address);
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
const inc_total_by = (sign: Sign, { address, amount }: {
    address: Address, amount: Amount
}) => {
    const x_address = hex_40(address);
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
        address: Address, block_hash: BlockHash, amount: Amount
    },
    total_by: Amount, total: Amount
) => void;
export type OnNonceRemoved = (
    nonce: Nonce, item: {
        address: Address, block_hash: BlockHash, amount: Amount
    },
    total_by: Amount, total: Amount
) => void;

export function onNonceAdded(
    store: Store<State, Action>, handler: OnNonceAdded
): Unsubscribe {
    const selector = (state: State) => state.nonces;
    const observer = observe<Nonces>(store)(
        selector, Empty<Nonces>()
    );
    return observer((next) => {
        const added = (n: Nonce) => {
            const total_by = inc_total_by(Sign.positive, next.items[n]);
            const total = inc_total(Sign.positive, next.items[n]);
            handler(n, next.items[n], total_by, total);
        };
        if (next.more) {
            next.more.forEach(added);
        } else if (!next.less) {
            const nonces = Object.keys(next.items).map(Number);
            nonces.forEach(added); // restore on:load
        }
    });
}
export function onNonceRemoved(
    store: Store<State, Action>, handler: OnNonceRemoved
): Unsubscribe {
    const selector = (state: State) => state.nonces;
    const observer = observe<Nonces>(store)(
        selector, Empty<Nonces>()
    );
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
