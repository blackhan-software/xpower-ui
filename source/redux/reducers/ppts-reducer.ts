import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { Amount, Empty, Nft, NftFullId, NftIssue, NftLevel, Nfts, NftToken, Supply } from '../types';

const fullId = (ppt: NftFullId | {
    token: NftToken, issue: NftIssue, level: NftLevel
}) => {
    return typeof ppt !== 'string' ? Nft.fullId(ppt) : ppt;
};
export function pptsReducer(
    ppts = Empty<Nfts>(), action: Action
): Nfts {
    if (actions.setPpt.match(action)) {
        const { item, nft } = action.payload;
        const items = { ...ppts.items };
        const id = fullId(nft);
        const s = item.supply;
        const a = item.amount;
        items[id] = pack(a, s, { id });
        return { items, more: [id] };
    }
    if (actions.addPpt.match(action)) {
        const { item, nft } = action.payload;
        const items = { ...ppts.items };
        const id = fullId(nft);
        const item_old = items[id];
        const item_new = {
            amount: item?.amount ?? 1n,
            supply: item?.supply
        };
        if (item_old) {
            const s = item_new.supply ?? item_old.supply + item_new.amount;
            const a = item_old.amount + item_new.amount;
            items[id] = pack(a, s, { id });
        } else {
            const s = item_new.supply ?? item_new.amount;
            const a = item_new.amount;
            items[id] = pack(a, s, { id });
        }
        return { items, more: [id] };
    }
    if (actions.removePpt.match(action)) {
        const { item, nft } = action.payload;
        const items = { ...ppts.items };
        const id = fullId(nft);
        const item_old = items[id];
        const item_new = {
            amount: item?.amount ?? 1n,
            supply: item?.supply
        };
        if (item_old) {
            const delta = item?.kind === 'burn' ? item_new.amount : 0n;
            const s = item_new.supply ?? item_old.supply - delta;
            const a = item_old.amount - item_new.amount;
            items[id] = pack(a, s, { id });
        } else {
            const s = item_new.supply ?? 0n;
            const a = 0n - item_new.amount;
            items[id] = pack(a, s, { id });
        }
        return { items, less: [id] };
    }
    return ppts;
}
function pack(amount: Amount, supply: Supply, { id }: { id: NftFullId }) {
    if (supply < amount) {
        throw new Error(`PPT(${id}) supply=${supply} < amount=${amount}`);
    }
    if (supply < 0) {
        throw new Error(`PPT(${id}) supply=${supply} < 0`);
    }
    return { amount, supply };
}
export default pptsReducer;
