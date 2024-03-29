import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { AppState } from '../store';
import { Amount, Empty, NftFullId, Nfts, Supply } from '../types';

export type OnPptAdded = (
    id: NftFullId,
    item: { amount: Amount, supply: Supply },
    total_by: { amount: Amount, supply: Supply }
) => void;
export type OnPptRemoved = (
    id: NftFullId,
    item: { amount: Amount, supply: Supply },
    total_by: { amount: Amount, supply: Supply }
) => void;
export type OnPptChanged
    = OnPptAdded | OnPptRemoved;

export function onPptAdded(
    store: Store<AppState, AnyAction>,
    handler: OnPptAdded
): Unsubscribe {
    const selector = (state: AppState) => state.ppts;
    const observer = observe<Nfts>(store)(
        selector, Empty<Nfts>()
    );
    return observer((next) => {
        const added = (id: NftFullId) => {
            const prefix = id.slice(0, 4);
            const suffix = id.slice(-2);
            const amount = Object.entries(next.items)
                .filter(([nft_id]) => nft_id.startsWith(prefix))
                .filter(([nft_id]) => nft_id.endsWith(suffix))
                .map(([_, { amount }]) => amount)
                .reduce((t, a) => t + a, 0n);
            const supply = Object.entries(next.items)
                .filter(([nft_id]) => nft_id.startsWith(prefix))
                .filter(([nft_id]) => nft_id.endsWith(suffix))
                .map(([_, { supply }]) => supply)
                .reduce((t, s) => t + s, 0n);
            handler(
                id, next.items[id], { amount, supply }
            );
        };
        if (next.more) {
            next.more.forEach(added);
        }
    });
}
export function onPptRemoved(
    store: Store<AppState, AnyAction>,
    handler: OnPptRemoved
): Unsubscribe {
    const selector = (state: AppState) => state.ppts;
    const observer = observe<Nfts>(store)(
        selector, Empty<Nfts>()
    );
    return observer((next) => {
        const removed = (id: NftFullId) => {
            const prefix = id.slice(0, 4);
            const suffix = id.slice(-2);
            const amount = Object.entries(next.items)
                .filter(([nft_id]) => nft_id.startsWith(prefix))
                .filter(([nft_id]) => nft_id.endsWith(suffix))
                .map(([_, { amount }]) => amount)
                .reduce((t, a) => t + a, 0n);
            const supply = Object.entries(next.items)
                .filter(([nft_id]) => nft_id.startsWith(prefix))
                .filter(([nft_id]) => nft_id.endsWith(suffix))
                .map(([_, { supply }]) => supply)
                .reduce((t, s) => t + s, 0n);
            handler(
                id, next.items[id], { amount, supply }
            );
        };
        if (next.less) {
            next.less.forEach(removed);
        }
    });
}
export function onPptChanged(
    store: Store<AppState, AnyAction>,
    handler: OnPptChanged
): Unsubscribe {
    const un_add = onPptAdded(store, handler);
    const un_rem = onPptRemoved(store, handler);
    return () => { un_add(); un_rem(); };
}
export default onPptChanged;
