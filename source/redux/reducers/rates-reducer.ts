import { Action } from '@reduxjs/toolkit';
import { APR, APRBonus } from '../../contract';
import * as actions from '../actions';
import { Empty, Index, Rates } from '../types';
import Tokenizer from '../../token';

export function ratesReducer(
    rates = Empty<Rates>(), action: Action
): Rates {
    if (actions.setAPR.match(action)) {
        const { token, index, item } = action.payload;
        const xtoken = Tokenizer.xify(token);
        const by_token = rates.items[xtoken] ?? {
            apr: {} as Record<Index, APR>,
            bonus: {} as Record<Index, APRBonus>,
        };
        const items = {
            ...rates.items, [xtoken]: {
                ...rates.items[xtoken], apr: {
                    ...by_token.apr, [index]: { ...item }
                },
            }
        };
        return {
            ...rates, items, more: [xtoken, index], less: undefined
        };
    }
    if (actions.setAPRBonus.match(action)) {
        const { token, index, item } = action.payload;
        const xtoken = Tokenizer.xify(token);
        const by_token = rates.items[xtoken] ?? {
            apr: {} as Record<Index, APR>,
            bonus: {} as Record<Index, APRBonus>,
        };
        const items = {
            ...rates.items, [xtoken]: {
                ...rates.items[xtoken], bonus: {
                    ...by_token.bonus, [index]: { ...item }
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
