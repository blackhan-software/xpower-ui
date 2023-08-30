import { Action } from '@reduxjs/toolkit';
import { APB, APR } from '../../contract';
import { Empty, Index, Rates } from '../types';

import * as actions from '../actions';

export function ratesReducer(
    rates = Empty<Rates>(), action: Action
): Rates {
    if (actions.setAPR.match(action)) {
        const { level, index, item } = action.payload;
        const by_level = rates.items[level] ?? {
            apr: {} as Record<Index, APR>,
            bonus: {} as Record<Index, APB>,
        };
        const items = {
            ...rates.items, [level]: {
                ...rates.items[level], apr: {
                    ...by_level.apr, [index]: { ...item }
                }
            }
        };
        return {
            ...rates, items, more: [index], less: undefined
        };
    }
    if (actions.setAPB.match(action)) {
        const { level, index, item } = action.payload;
        const by_level = rates.items[level] ?? {
            apr: {} as Record<Index, APR>,
            bonus: {} as Record<Index, APB>,
        };
        const items = {
            ...rates.items, [level]: {
                ...rates.items[level], bonus: {
                    ...by_level.bonus, [index]: { ...item }
                }
            }
        };
        return {
            ...rates, items, more: [index], less: undefined
        };
    }
    return rates;
}
export default ratesReducer;
