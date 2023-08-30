import { createAction } from '@reduxjs/toolkit';
import { Area, Index, NftLevel, Rate, Timestamp } from '../types';

export const setAPR = createAction('rates/set-apr', (
    level: NftLevel, index: Index, item: {
        stamp: Timestamp, value: Rate, area: Area
    }
) => ({
    payload: { level, index, item }
}));
export const setAPB = createAction('rates/set-apb', (
    level: NftLevel, index: Index, item: {
        stamp: Timestamp, value: Rate, area: Area
    }
) => ({
    payload: { level, index, item }
}));
