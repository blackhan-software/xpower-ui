import { setAPR, setAPB } from '../actions';
import { Empty, NftLevel } from '../types';
import { Rates } from '../types/rates';
import { ratesReducer } from './rates-reducer';

describe('Store w/rates-reducer (set)', () => {
    const l = NftLevel.KILO;
    it('should set-apr', () => {
        const state_0 = Empty<Rates>();
        const state_1 = ratesReducer(state_0, setAPR(l, 0, {
            stamp: 0n, value: 1n, area: 2n
        }));
        const item = state_1.items[l];
        expect(item && item.apr[0]).toEqual({
            stamp: 0n, value: 1n, area: 2n
        });
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([0]);
    });
    it('should set-apb', () => {
        const state_0 = Empty<Rates>();
        const state_1 = ratesReducer(state_0, setAPB(l, 0, {
            stamp: 0n, value: 1n, area: 2n
        }));
        const item = state_1.items[l];
        expect(item && item.bonus[0]).toEqual({
            stamp: 0n, value: 1n, area: 2n
        });
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([0]);
    });
});
