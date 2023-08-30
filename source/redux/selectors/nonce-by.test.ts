import { nonceBy } from './nonce-by';

describe('nonce-by', () => {
    const account = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    it('should return nonce = undefined', () => {
        const { nonce } = nonceBy({ nonces: { items: {} } }, {
            account, block_hash, amount: 0n
        });
        expect(nonce).not.toBeDefined();
    });
    it('should return nonce = 0xffff', () => {
        const { nonce } = nonceBy({
            nonces: {
                items: {
                    '0xffff': { account, amount: 1n, block_hash },
                }
            }
        }, {
            account, block_hash, amount: 1n
        });
        expect(nonce).toEqual('0xffff');
    });
    it('should return nonce = 0xfff0', () => {
        const { nonce } = nonceBy({
            nonces: {
                items: {
                    '0xffff': { account, amount: 1n, block_hash },
                    '0xfff0': { account, amount: 2n, block_hash },
                }
            }
        }, {
            account, amount: 2n, block_hash
        });
        expect(nonce).toEqual('0xfff0');
    });
    it('should return nonce = 0x0000', () => {
        const { nonce } = nonceBy({
            nonces: {
                items: {
                    '0xffff': { account, amount: 1n, block_hash },
                    '0xfff0': { account, amount: 2n, block_hash },
                    '0xff00': { account, amount: 3n, block_hash },
                    '0xf000': { account, amount: 3n, block_hash },
                    '0x0000': { account, amount: 3n, block_hash },
                }
            }
        }, {
            account, amount: 3n, block_hash
        }, 2);
        expect(nonce).toEqual('0x0000');
    });
});
