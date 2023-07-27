/* eslint @typescript-eslint/no-explicit-any: [off] */
import { historyReducer } from './history-reducer';

import { setMoeHistory, setSovHistory } from '../actions';
import { setNftHistory, setPptHistory } from '../actions';
import { Empty, Token, History } from '../types';
import { Version } from '../../types';

describe('Store w/history-reducer (set)', () => {
    const v = Version.v2a
    const t = Token.XPOW;
    it('should set-moe-history to balance=1', () => {
        const state_0 = Empty<History>();
        const state_1 = historyReducer(state_0, setMoeHistory(v, t, {
            balance: 1n
        }));
        const item = state_1.items[v];
        expect(item && item[t]).toEqual({ moe: {
            balance: 1n
        }});
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([v, t]);
    });
    it('should set-sov-history to balance=1', () => {
        const state_0 = Empty<History>();
        const state_1 = historyReducer(state_0, setSovHistory(v, t, {
            balance: 1n
        }));
        const item = state_1.items[v];
        expect(item && item[t]).toEqual({ sov: {
            balance: 1n
        }});
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([v, t]);
    });
    it('should set-nft-history to balance=1 (for id=2202100)', () => {
        const state_0 = Empty<History>();
        const state_1 = historyReducer(state_0, setNftHistory(v, t, {
            '2202100': { balance: 1n }
        }));
        const item = state_1.items[v];
        expect(item && item[t]).toEqual({ nft: {
            '2202100': { balance: 1n }
        }});
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([v, t]);
    });
    it('should set-ppt-history to balance=1 (for id=2202100)', () => {
        const state_0 = Empty<History>();
        const state_1 = historyReducer(state_0, setPptHistory(v, t, {
            '2202100': { balance: 1n }
        }));
        const item = state_1.items[v];
        expect(item && item[t]).toEqual({ ppt: {
            '2202100': { balance: 1n }
        }});
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([v, t]);
    });
});
