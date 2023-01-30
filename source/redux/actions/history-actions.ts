import { createAction } from '@reduxjs/toolkit';
import { Version } from '../../types';
import { Balance, NftFullId, Token } from '../types';

export const setMoeHistory = createAction('history/set-moe', (
    version: Version, token: Token, item: {
        balance: Balance
    }
) => ({
    payload: { version, token, item }
}));
export const setSovHistory = createAction('history/set-sov', (
    version: Version, token: Token, item: {
        balance: Balance
    }
) => ({
    payload: { version, token, item }
}));
export const setNftHistory = createAction('history/set-nft', (
    version: Version, token: Token, item: {
        [id: NftFullId]: { balance: Balance }
    }
) => ({
    payload: { version, token, item }
}));
export const setPptHistory = createAction('history/set-ppt', (
    version: Version, token: Token, item: {
        [id: NftFullId]: { balance: Balance }
    }
) => ({
    payload: { version, token, item }
}));
