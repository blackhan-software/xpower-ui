import { Action } from '../actions/wallet-actions';
import { Wallet, Token, Empty } from '../types';
import { Amount, Supply } from '../types';

export function walletReducer(
    wallet = Empty<Wallet>(), action: Action
): Wallet {
    if (!action.type.startsWith('wallet/')) {
        return wallet;
    }
    const items = { ...wallet.items };
    const token = action.payload.token;
    if (action.type === 'wallet/set') {
        const s = action.payload.item.supply;
        const a = action.payload.item.amount;
        items[token] = pack(a, s, { token: token });
        return { items, more: [token] };
    }
    if (action.type === 'wallet/increase') {
        const item_old = items[token];
        const item_new = {
            amount: action.payload.item?.amount ?? 1n,
            supply: action.payload.item?.supply
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
    if (action.type === 'wallet/decrease') {
        const item_old = items[token];
        const item_new = {
            amount: action.payload.item?.amount ?? 1n,
            supply: action.payload.item?.supply
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
    return wallet;
}
function pack(amount: Amount, supply: Supply, { token }: { token: Token }) {
    if (supply < amount) {
        throw new Error(`${token} supply=${supply} < amount=${amount}`);
    }
    if (supply < 0) {
        throw new Error(`${token} supply=${supply} < 0`);
    }
    return { amount, supply };
}
export default walletReducer;
