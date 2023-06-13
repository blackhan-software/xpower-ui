import { setAPR, setAPRBonus } from '../actions';
import { Empty, NftLevel, Token } from '../types';
import { Rates } from '../types/rates';
import { ratesReducer } from './rates-reducer';

describe('Store w/rates-reducer (set)', () => {
    const t = Token.THOR;
    const l = NftLevel.KILO;
    it('should set-apr', () => {
        const state_0 = Empty<Rates>();
        const state_1 = ratesReducer(state_0, setAPR(t, l, 0, {
            stamp: 0n, value: 1n, area: 2n
        }));
        const item = state_1.items[t];
        expect(item && item[l] && item[l].apr[0]).toEqual({
            stamp: 0n, value: 1n, area: 2n
        });
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([t, 0]);
    });
    it('should set-apr-bonus', () => {
        const state_0 = Empty<Rates>();
        const state_1 = ratesReducer(state_0, setAPRBonus(t, l, 0, {
            stamp: 0n, value: 1n, area: 2n
        }));
        const item = state_1.items[t];
        expect(item && item[l] && item[l].bonus[0]).toEqual({
            stamp: 0n, value: 1n, area: 2n
        });
        expect(state_1.less).not.toBeDefined();
        expect(state_1.more).toEqual([t, 0]);
    });
});
