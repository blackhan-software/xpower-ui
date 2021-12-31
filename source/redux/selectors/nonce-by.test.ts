import { nonceBy } from './nonce-by';

describe('nonce-by', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    it('should return nonce = undefined', () => {
        const nonce = nonceBy({ items: {} }, {
            address, block_hash, amount: 0n
        });
        expect(nonce).not.toBeDefined();
    });
    it('should return nonce = 0xffff', () => {
        const nonce = nonceBy({
            items: {
                0xffff: {
                    address, block_hash, amount: 1n
                }
            }
        }, {
            address, block_hash, amount: 1n
        });
        expect(nonce).toEqual(0xffff);
    });
    it('should return nonce = 0xfff0', () => {
        const nonce = nonceBy({
            items: {
                0xffff: { address, block_hash, amount: 1n },
                0xfff0: { address, block_hash, amount: 2n }
            }
        }, {
            address, block_hash, amount: 2n
        });
        expect(nonce).toEqual(0xfff0);
    });
    it('should return nonce = 0x0000', () => {
        const nonce = nonceBy({
            items: {
                0xffff: { address, block_hash, amount: 1n },
                0xfff0: { address, block_hash, amount: 2n },
                0xff00: { address, block_hash, amount: 3n },
                0xf000: { address, block_hash, amount: 3n },
                0x0000: { address, block_hash, amount: 3n }
            }
        }, {
            address, block_hash, amount: 3n
        }, 2);
        expect(nonce).toEqual(0xff00);
    });
});
