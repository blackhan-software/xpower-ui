import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { Empty, History } from '../types';

export function historyReducer(
    history = Empty<History>(), action: Action
): History {
    if (actions.setMoeHistory.match(action)) {
        const { version, item } = action.payload;
        const items = {
            ...history.items, [version]: {
                ...history.items[version], moe: item
            }
        };
        return {
            ...history, items, more: [version], less: undefined
        };
    }
    if (actions.setSovHistory.match(action)) {
        const { version, item } = action.payload;
        const items = {
            ...history.items, [version]: {
                ...history.items[version], sov: item
            }
        };
        return {
            ...history, items, more: [version], less: undefined
        };
    }
    if (actions.setNftHistory.match(action)) {
        const { version, item } = action.payload;
        const items = {
            ...history.items, [version]: {
                ...history.items[version], nft: item
            }
        };
        return {
            ...history, items, more: [version], less: undefined
        };
    }
    if (actions.setPptHistory.match(action)) {
        const { version, item } = action.payload;
        const items = {
            ...history.items, [version]: {
                ...history.items[version], ppt: item
            }
        };
        return {
            ...history, items, more: [version], less: undefined
        };
    }
    return history;
}
export default historyReducer;
