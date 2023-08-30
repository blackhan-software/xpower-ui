/* eslint @typescript-eslint/no-explicit-any: [off] */
import { historyReducer } from './history-reducer';

import { Version } from '../../types';
import { setMoeHistory, setNftHistory, setPptHistory, setSovHistory } from '../actions';
import { Empty, History } from '../types';

describe('Store w/history-reducer (set)', () => {
    const v = Version.v2a
    it('should set-moe-history to balance=1', () => {
        const state_0 = Empty<History>();
        const state_1 = historyReducer(state_0, setMoeHistory(v, {
            balance: 1n
        }));
        const item = state_1.items[v];
        expect(item).toEqual({ moe: {
            balance: 1n
        }});
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([v]);
    });
    it('should set-sov-history to balance=1', () => {
        const state_0 = Empty<History>();
        const state_1 = historyReducer(state_0, setSovHistory(v, {
            balance: 1n
        }));
        const item = state_1.items[v];
        expect(item).toEqual({ sov: {
            balance: 1n
        }});
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([v]);
    });
    it('should set-nft-history to balance=1 (for id=2202100)', () => {
        const state_0 = Empty<History>();
        const state_1 = historyReducer(state_0, setNftHistory(v, {
            '2202100': { balance: 1n }
        }));
        const item = state_1.items[v];
        expect(item).toEqual({ nft: {
            '2202100': { balance: 1n }
        }});
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([v]);
    });
    it('should set-ppt-history to balance=1 (for id=2202100)', () => {
        const state_0 = Empty<History>();
        const state_1 = historyReducer(state_0, setPptHistory(v, {
            '2202100': { balance: 1n }
        }));
        const item = state_1.items[v];
        expect(item).toEqual({ ppt: {
            '2202100': { balance: 1n }
        }});
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([v]);
    });
});
