import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { AftWallet, Amount, Collat, Supply, Token } from '../types';

export function initialState() {
    return { items: {}, burner: null } as AftWallet;
}
export function aftWalletReducer(
    aft_wallet = initialState(), action: Action
): AftWallet {
    if (actions.setAftWallet.match(action)) {
        const { token, item: { amount: a, supply: s, collat: c } } = action.payload;
        const items = { ...aft_wallet.items };
        items[token] = pack(a, s, c, token);
        return {
            ...aft_wallet, items, more: [token], less: undefined
        };
    }
    if (actions.increaseAftWallet.match(action)) {
        const { token, item } = action.payload;
        const items = { ...aft_wallet.items };
        const item_old = items[token];
        const item_new = {
            amount: item?.amount ?? 1n,
            supply: item?.supply,
        };
        if (item_old) {
            const s = item_new.supply ?? item_old.supply + item_new.amount;
            const a = item_old.amount + item_new.amount;
            const c = item_old.collat;
            items[token] = pack(a, s, c, token);
        } else {
            const s = item_new.supply ?? item_new.amount;
            const a = item_new.amount;
            items[token] = pack(a, s, 0n, token);
        }
        return {
            ...aft_wallet, items, more: [token], less: undefined
        };
    }
    if (actions.decreaseAftWallet.match(action)) {
        const { token, item } = action.payload;
        const items = { ...aft_wallet.items };
        const item_old = items[token];
        const item_new = {
            amount: item?.amount ?? 1n,
            supply: item?.supply
        };
        if (item_old) {
            const s = item_new.supply ?? item_old.supply;
            const a = item_old.amount - item_new.amount;
            const c = item_old.collat;
            items[token] = pack(a, s, c, token);
        } else {
            const s = item_new.supply ?? 0n;
            const a = 0n - item_new.amount;
            items[token] = pack(a, s, 0n, token);
        }
        return {
            ...aft_wallet, items, less: [token], more: undefined
        };
    }
    if (actions.setAftWalletBurner.match(action)) {
        return {
            ...aft_wallet, more: undefined, less: undefined,
            burner: action.payload.burner
        };
    }
    return aft_wallet;
}
function pack(
    a: Amount, s: Supply, c: Collat, t: Token,
) {
    if (s < a) {
        throw new Error(`${t} supply=${s} < amount=${a}`);
    }
    if (s < 0) {
        throw new Error(`${t} supply=${s} < 0`);
    }
    return { amount: a, supply: s, collat: c };
}
export default aftWalletReducer;
