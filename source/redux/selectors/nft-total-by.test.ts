import { NftLevel } from '../types';
import { nftTotalBy } from './nft-total-by';

describe('nft-total-by', () => {
    const issue = 2021;
    const level = NftLevel.UNIT;
    it('should return total = { amount: 0n, supply: 0n }', () => {
        const total = nftTotalBy({ nfts: { items: {} } });
        expect(total).toEqual({
            amount: 0n, supply: 0n
        });
    });
    it('should return total = { amount: 1n, supply: 2n }', () => {
        const total = nftTotalBy({
            nfts: {
                items: {
                    '2202100': {
                        amount: 1n, supply: 2n
                    }
                }
            }
        }, {
            issue, level
        });
        expect(total).toEqual({
            amount: 1n, supply: 2n
        });
    });
    it('should return total = { amount: 3n, supply: 6n }', () => {
        const total = nftTotalBy({
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
        }, {
            issue
        });
        expect(total).toEqual({
            amount: 3n, supply: 6n
        });
    });
});
