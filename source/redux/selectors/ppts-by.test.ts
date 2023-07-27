import { NftLevel, NftToken } from '../types';
import { pptsBy } from './ppts-by';

describe('ppts-by', () => {
    const issue = 2021;
    const level = NftLevel.UNIT;
    const token = NftToken.XPOW;
    it('should return {}', () => {
        const state = { ppts: { items: {} } };
        const ppts_by = pptsBy(state);
        expect(ppts_by).toEqual(state.ppts);
    });
    it('should return { "XPOW:2021": ... }', () => {
        const state = {
            ppts: {
                items: {
                    '2202100': {
                        amount: 1n, supply: 2n
                    }
                }
            }
        };
        const ppts_by = pptsBy(state, {
            issue, level, token
        });
        expect(ppts_by).toEqual(state.ppts);
    });
    it('should return { "XPOW:2021": ..., "XPOW:2022": ... }', () => {
        const state = {
            ppts: {
                items: {
                    '2202100': {
                        amount: 1n, supply: 2n
                    },
                    '2202103': {
                        amount: 2n, supply: 4n
                    }
                }
            }
        };
        const ppts_by = pptsBy(state, {
            issue, token
        });
        expect(ppts_by).toEqual(state.ppts);
    });
});
