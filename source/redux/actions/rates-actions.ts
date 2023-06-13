import { createAction } from '@reduxjs/toolkit';
import { Area, Index, NftLevel, Rate, Timestamp, Token } from '../types';

export const setAPR = createAction('rates/set-apr', (
    token: Token, level: NftLevel, index: Index, item: {
        stamp: Timestamp, value: Rate, area: Area
    }
) => ({
    payload: { token, level, index, item }
}));
export const setAPRBonus = createAction('rates/set-apr-bonus', (
    token: Token, level: NftLevel, index: Index, item: {
        stamp: Timestamp, value: Rate, area: Area
    }
) => ({
    payload: { token, level, index, item }
}));
