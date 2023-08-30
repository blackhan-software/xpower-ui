import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { Amount, Empty, Nft, NftFullId, NftIssue, NftLevel, Nfts, Supply } from '../types';

const fullId = (nft: NftFullId | {
    issue: NftIssue, level: NftLevel
}) => {
    return typeof nft !== 'string' ? Nft.fullId(nft) : nft;
};
export function nftsReducer(
    nfts = Empty<Nfts>(), action: Action
): Nfts {
    if (actions.setNft.match(action)) {
        const { item, nft } = action.payload;
        const items = { ...nfts.items };
        const id = fullId(nft);
        const s = item.supply;
        const a = item.amount;
        items[id] = pack(a, s, { id });
        return { items, more: [id] };
    }
    if (actions.addNft.match(action)) {
        const { item, nft } = action.payload;
        const items = { ...nfts.items };
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
    if (actions.removeNft.match(action)) {
        const { item, nft } = action.payload;
        const items = { ...nfts.items };
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
    return nfts;
}
function pack(amount: Amount, supply: Supply, { id }: { id: NftFullId }) {
    if (supply < amount) {
        throw new Error(`NFT(${id}) supply=${supply} < amount=${amount}`);
    }
    if (supply < 0) {
        throw new Error(`NFT(${id}) supply=${supply} < 0`);
    }
    return { amount, supply };
}
export default nftsReducer;
