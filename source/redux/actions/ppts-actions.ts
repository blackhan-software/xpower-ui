import { createAction } from '@reduxjs/toolkit';
import { Amount, NftFullId, NftIssue, NftLevel, NftToken, Supply } from '../types';

export const setPpt = createAction('ppts/set', (
    nft: NftFullId | {
        token: NftToken;
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
export const addPpt = createAction('ppts/add', (
    nft: NftFullId | {
        token: NftToken;
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
export const removePpt = createAction('ppts/remove', (
    nft: NftFullId | {
        token: NftToken;
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
