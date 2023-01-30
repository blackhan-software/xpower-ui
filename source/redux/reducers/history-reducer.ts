import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { Empty, History } from '../types';

export function historyReducer(
    history = Empty<History>(), action: Action
): History {
    if (actions.setMoeHistory.match(action)) {
        const { version, token, item } = action.payload;
        const by_version = history.items[version] ?? {};
        const by_token = by_version[token] ?? {};
        const items = {
            ...history.items, [version]: {
                ...history.items[version], [token]: {
                    ...by_token, moe: item
                }
            }
        };
        return {
            ...history, items, more: [version, token], less: undefined
        };
    }
    if (actions.setSovHistory.match(action)) {
        const { version, token, item } = action.payload;
        const by_version = history.items[version] ?? {};
        const by_token = by_version[token] ?? {};
        const items = {
            ...history.items, [version]: {
                ...history.items[version], [token]: {
                    ...by_token, sov: item
                }
            }
        };
        return {
            ...history, items, more: [version, token], less: undefined
        };
    }
    if (actions.setNftHistory.match(action)) {
        const { version, token, item } = action.payload;
        const by_version = history.items[version] ?? {};
        const by_token = by_version[token] ?? {};
        const items = {
            ...history.items, [version]: {
                ...history.items[version], [token]: {
                    ...by_token, nft: item
                }
            }
        };
        return {
            ...history, items, more: [version, token], less: undefined
        };
    }
    if (actions.setPptHistory.match(action)) {
        const { version, token, item } = action.payload;
        const by_version = history.items[version] ?? {};
        const by_token = by_version[token] ?? {};
        const items = {
            ...history.items, [version]: {
                ...history.items[version], [token]: {
                    ...by_token, ppt: item
                }
            }
        };
        return {
            ...history, items, more: [version, token], less: undefined
        };
    }
    return history;
}
export default historyReducer;
