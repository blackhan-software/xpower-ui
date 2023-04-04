import { createAction } from '@reduxjs/toolkit';
import { Area, Index, Rate, Timestamp, Token } from '../types';

export const setAPR = createAction('rates/set-apr', (
    token: Token, index: Index, item: {
        stamp: Timestamp, value: Rate, area: Area
    }
) => ({
    payload: { token, index, item }
}));
export const setAPRBonus = createAction('rates/set-apr-bonus', (
    token: Token, index: Index, item: {
        stamp: Timestamp, value: Rate, area: Area
    }
) => ({
    payload: { token, index, item }
}));
