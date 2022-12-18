import { NftLevel, NftToken } from '../types';
import { pptTotalBy } from './ppt-total-by';

describe('ppt-total-by', () => {
    const issue = 2021;
    const level = NftLevel.UNIT;
    const token = NftToken.ODIN;
    it('should return total = { amount: 0n, supply: 0n }', () => {
        const total = pptTotalBy({ ppts: { items: {} } });
        expect(total).toEqual({
            amount: 0n, supply: 0n
        });
    });
    it('should return total = { amount: 1n, supply: 2n }', () => {
        const total = pptTotalBy({
            ppts: {
                items: {
                    '3202100': {
                        amount: 1n, supply: 2n
                    }
                }
            }
        }, {
            issue, level, token
        });
        expect(total).toEqual({
            amount: 1n, supply: 2n
        });
    });
    it('should return total = { amount: 3n, supply: 6n }', () => {
        const total = pptTotalBy({
            ppts: {
                items: {
                    '3202100': {
                        amount: 1n, supply: 2n
                    },
                    '3202103': {
                        amount: 2n, supply: 4n
                    }
                }
            }
        }, {
            issue, token
        });
        expect(total).toEqual({
            amount: 3n, supply: 6n
        });
    });
});
