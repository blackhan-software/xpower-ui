import { NftLevel } from '../types';
import { nftsBy } from './nfts-by';

describe('nfts-by', () => {
    const issue = 2021;
    const level = NftLevel.UNIT;
    it('should return {}', () => {
        const state = { nfts: { items: {} } };
        const nfts_by = nftsBy(state);
        expect(nfts_by).toEqual(state.nfts);
    });
    it('should return { "XPOW:2021": ... }', () => {
        const state = {
            nfts: {
                items: {
                    '2202100': {
                        amount: 1n, supply: 2n
                    }
                }
            }
        };
        const nfts_by = nftsBy(state, {
            issue, level
        });
        expect(nfts_by).toEqual(state.nfts);
    });
    it('should return { "XPOW:2021": ..., "XPOW:2022": ... }', () => {
        const state = {
            nfts: {
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
        const nfts_by = nftsBy(state, {
            issue
        });
        expect(nfts_by).toEqual(state.nfts);
    });
});
