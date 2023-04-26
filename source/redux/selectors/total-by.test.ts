import { Token } from '../types';
import { totalBy } from './total-by';

describe('total-by', () => {
    const account = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    const token = Token.THOR;
    it('should sum to 0', () => {
        const sum = totalBy({ nonces: { items: {} } }, {
            account, amount: 0n, block_hash, token
        });
        expect(sum).toEqual(0n);
    });
    it('should sum to 1', () => {
        const sum = totalBy({
            nonces: {
                items: {
                    0xffff: { account, amount: 1n, block_hash, token },
                }
            }
        }, {
            account, amount: 1n, block_hash, token
        });
        expect(sum).toEqual(1n);
    });
    it('should sum to 2', () => {
        const sum = totalBy({
            nonces: {
                items: {
                    0xffff: { account, amount: 1n, block_hash, token },
                    0xfff0: { account, amount: 2n, block_hash, token },
                }
            }
        }, {
            account, amount: 2n, block_hash, token
        });
        expect(sum).toEqual(2n);
    });
    it('should sum to 3', () => {
        const sum = totalBy({
            nonces: {
                items: {
                    0xffff: { account, amount: 1n, block_hash, token },
                    0xfff0: { account, amount: 2n, block_hash, token },
                    0xff00: { account, amount: 3n, block_hash, token },
                }
            }
        }, {
            account, amount: 3n, block_hash, token
        });
        expect(sum).toEqual(3n);
    });
});
