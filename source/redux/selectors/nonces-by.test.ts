import { noncesBy } from './nonces-by';

describe('nonces-by', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    it('should return nonces.length = 0', () => {
        const nonces = noncesBy({ items: {} }, {
            address, block_hash, amount: 0n
        });
        expect(nonces.length).toEqual(0);
    });
    it('should return nonces[0] = 0xffff', () => {
        const nonces = noncesBy({
            items: {
                0xffff: {
                    address, block_hash, amount: 1n
                }
            }
        }, {
            address, block_hash, amount: 1n
        });
        expect(nonces.length).toEqual(1);
        expect(nonces[0]).toEqual(0xffff);
    });
    it('should return nonces[0] = 0xfff0', () => {
        const nonces = noncesBy({
            items: {
                0xffff: { address, block_hash, amount: 1n },
                0xfff0: { address, block_hash, amount: 2n }
            }
        }, {
            address, block_hash, amount: 2n
        });
        expect(nonces.length).toEqual(1);
        expect(nonces[0]).toEqual(0xfff0);
    });
    it('should return nonces[2] = 0xff00', () => {
        const nonces = noncesBy({
            items: {
                0xffff: { address, block_hash, amount: 1n },
                0xfff0: { address, block_hash, amount: 2n },
                0xff00: { address, block_hash, amount: 3n },
                0xf000: { address, block_hash, amount: 3n },
                0x0000: { address, block_hash, amount: 3n }
            }
        }, {
            address, block_hash, amount: 3n
        });
        expect(nonces[2]).toEqual(0xff00);
    });
});
