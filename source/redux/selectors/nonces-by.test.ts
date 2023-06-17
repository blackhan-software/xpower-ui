import { Token } from '../types';
import { noncesBy } from './nonces-by';

describe('nonces-by', () => {
    const account = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    const token = Token.THOR;
    it('should return nonces.length = 0', () => {
        const array = noncesBy({ nonces: { items: {} } }, {
            account, block_hash, amount: 0n, token
        });
        expect(array.length).toEqual(0);
    });
    it('should return nonces[0] = 0xffff', () => {
        const array = noncesBy({
            nonces: {
                items: {
                    '0xffff': { account, amount: 1n, block_hash, token }
                }
            }
        }, {
            account, amount: 1n, block_hash, token
        });
        expect(array.length).toEqual(1);
        expect(array[0].nonce).toEqual('0xffff');
    });
    it('should return nonces[0] = 0xfff0', () => {
        const array = noncesBy({
            nonces: {
                items: {
                    '0xffff': { account, amount: 1n, block_hash, token },
                    '0xfff0': { account, amount: 2n, block_hash, token },
                }
            }
        }, {
            account, amount: 2n, block_hash, token
        });
        expect(array.length).toEqual(1);
        expect(array[0].nonce).toEqual('0xfff0');
    });
    it('should return nonces[2] = 0x0000', () => {
        const array = noncesBy({
            nonces: {
                items: {
                    '0xffff': { account, amount: 1n, block_hash, token },
                    '0xfff0': { account, amount: 2n, block_hash, token },
                    '0xff00': { account, amount: 3n, block_hash, token },
                    '0xf000': { account, amount: 3n, block_hash, token },
                    '0x0000': { account, amount: 3n, block_hash, token },
                }
            }
        }, {
            account, block_hash, amount: 3n, token
        });
        expect(array[2].nonce).toEqual('0x0000');
    });
});
