import { Action } from '@reduxjs/toolkit';
import { APR, APB } from '../../contract';
import { Tokenizer } from '../../token';
import { Empty, Index, Rates } from '../types';

import * as actions from '../actions';

export function ratesReducer(
    rates = Empty<Rates>(), action: Action
): Rates {
    if (actions.setAPR.match(action)) {
        const { token, level, index, item } = action.payload;
        const xtoken = Tokenizer.xify(token);
        const by_token = rates.items[xtoken]?.[level] ?? {
            apr: {} as Record<Index, APR>,
            bonus: {} as Record<Index, APB>,
        };
        const items = {
            ...rates.items, [xtoken]: {
                ...rates.items[xtoken], [level]: {
                    ...rates.items[xtoken]?.[level], apr: {
                        ...by_token.apr, [index]: { ...item }
                    }
                }
            }
        };
        return {
            ...rates, items, more: [xtoken, index], less: undefined
        };
    }
    if (actions.setAPRBonus.match(action)) {
        const { token, level, index, item } = action.payload;
        const xtoken = Tokenizer.xify(token);
        const by_token = rates.items[xtoken]?.[level] ?? {
            apr: {} as Record<Index, APR>,
            bonus: {} as Record<Index, APB>,
        };
        const items = {
            ...rates.items, [xtoken]: {
                ...rates.items[xtoken], [level]: {
                    ...rates.items[xtoken]?.[level], bonus: {
                        ...by_token.bonus, [index]: { ...item }
                    }
                }
            }
        };
        return {
            ...rates, items, more: [xtoken, index], less: undefined
        };
    }
    return rates;
}
export default ratesReducer;
