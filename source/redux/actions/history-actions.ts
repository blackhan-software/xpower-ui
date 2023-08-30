import { createAction } from '@reduxjs/toolkit';
import { Version } from '../../types';
import { Balance, NftFullId } from '../types';

export const setMoeHistory = createAction('history/set-moe', (
    version: Version, item: {
        balance: Balance
    }
) => ({
    payload: { version, item }
}));
export const setSovHistory = createAction('history/set-sov', (
    version: Version, item: {
        balance: Balance
    }
) => ({
    payload: { version, item }
}));
export const setNftHistory = createAction('history/set-nft', (
    version: Version, item: {
        [id: NftFullId]: { balance: Balance }
    }
) => ({
    payload: { version, item }
}));
export const setPptHistory = createAction('history/set-ppt', (
    version: Version, item: {
        [id: NftFullId]: { balance: Balance }
    }
) => ({
    payload: { version, item }
}));
