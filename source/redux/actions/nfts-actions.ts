import { createAction } from '@reduxjs/toolkit';
import { Amount, NftFullId, NftIssue, NftLevel, Supply } from '../types';

export const setNft = createAction('nfts/set', (
    nft: NftFullId | {
        issue: NftIssue;
        level: NftLevel;
    },
    item: {
        amount: Amount; // new-amount = amount
        supply: Supply; // new-supply = supply
    }
) => ({
    payload: { nft, item }
}));
export const addNft = createAction('nfts/add', (
    nft: NftFullId | {
        issue: NftIssue;
        level: NftLevel;
    },
    item?: {
        amount: Amount; // new-amount = old-amount + amount
        supply?: Supply;// new-supply = supply ?? old-supply + amount
    }
) => ({
    payload: { nft, item }
}));
export const removeNft = createAction('nfts/remove', (
    nft: NftFullId | {
        issue: NftIssue;
        level: NftLevel;
    },
    item?: {
        amount: Amount; // new-amount = old-amount - amount
        supply?: Supply;// new-supply = supply ?? old-supply - (0|amount)
        kind?: 'transfer' | 'burn';
    }
) => ({
    payload: { nft, item }
}));
