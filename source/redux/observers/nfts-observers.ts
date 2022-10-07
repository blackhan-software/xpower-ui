import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { AppState } from '../store';
import { Amount, Empty, NftFullId, Nfts, Supply } from '../types';

export type OnNftAdded = (
    id: NftFullId,
    item: { amount: Amount, supply: Supply },
    total_by: { amount: Amount, supply: Supply }
) => void;
export type OnNftRemoved = (
    id: NftFullId,
    item: { amount: Amount, supply: Supply },
    total_by: { amount: Amount, supply: Supply }
) => void;

export function onNftAdded(
    store: Store<AppState, AnyAction>, handler: OnNftAdded
): Unsubscribe {
    const selector = (state: AppState) => state.nfts;
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
export function onNftRemoved(
    store: Store<AppState, AnyAction>, handler: OnNftRemoved
): Unsubscribe {
    const selector = (state: AppState) => state.nfts;
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
