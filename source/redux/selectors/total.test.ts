import { total } from './total';

describe('total', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    it('should sum to 0', () => {
        const sum = total({ items: {} }, {
            address, block_hash
        });
        expect(sum).toEqual(0n);
    });
    it('should sum to 1', () => {
        const sum = total({
            items: {
                0xffff: { address, block_hash, amount: 1n }
            }
        }, {
            address, block_hash
        });
        expect(sum).toEqual(1n);
    });
    it('should sum to 3', () => {
        const sum = total({
            items: {
                0xffff: { address, block_hash, amount: 1n },
                0xfff0: { address, block_hash, amount: 2n },
            }
        }, {
            address, block_hash
        });
        expect(sum).toEqual(3n);
    });
    it('should sum to 6', () => {
        const sum = total({
            items: {
                0xffff: { address, block_hash, amount: 1n },
                0xfff0: { address, block_hash, amount: 2n },
                0xff00: { address, block_hash, amount: 3n }
            }
        }, {
            address, block_hash
        });
        expect(sum).toEqual(6n);
    });
});
