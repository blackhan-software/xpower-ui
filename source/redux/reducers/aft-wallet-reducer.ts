import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { AftWallet, Amount, Empty, Supply, Token } from '../types';

export function aftWalletReducer(
    aft_wallet = Empty<AftWallet>(), action: Action
): AftWallet {
    if (actions.setAftWallet.match(action)) {
        const { token, item: { amount, supply } } = action.payload;
        const items = { ...aft_wallet.items };
        items[token] = pack(amount, supply, { token });
        return { items, more: [token] };
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
            items[token] = pack(a, s, { token: token });
        } else {
            const s = item_new.supply ?? item_new.amount;
            const a = item_new.amount;
            items[token] = pack(a, s, { token: token });
        }
        return { items, more: [token] };
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
            items[token] = pack(a, s, { token: token });
        } else {
            const s = item_new.supply ?? 0n;
            const a = 0n - item_new.amount;
            items[token] = pack(a, s, { token: token });
        }
        return { items, less: [token] };
    }
    return aft_wallet;
}
function pack(
    amount: Amount, supply: Supply, { token }: { token: Token }
) {
    if (supply < amount) {
        throw new Error(`${token} supply=${supply} < amount=${amount}`);
    }
    if (supply < 0) {
        throw new Error(`${token} supply=${supply} < 0`);
    }
    return { amount, supply };
}
export default aftWalletReducer;
