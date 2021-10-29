import { nonceBy } from './nonce-by';

describe('total', () => {
    const address = '0xabcd';
    it('should return nonce = undefined', () => {
        const nonce = nonceBy({ items: {} }, {
            address, amount: 0
        });
        expect(nonce).not.toBeDefined();
    });
    it('should return nonce = 0xffff', () => {
        const nonce = nonceBy({
            items: { '0xffff': { address, amount: 1 } }
        }, { address, amount: 1 });
        expect(nonce).toEqual('0xffff');
    });
    it('should return nonce = 0xfff0', () => {
        const nonce = nonceBy({
            items: {
                '0xffff': { address, amount: 1 },
                '0xfff0': { address, amount: 2 }
            }
        }, { address, amount: 2 });
        expect(nonce).toEqual('0xfff0');
    });
    it('should return nonce = 0x0000', () => {
        const nonce = nonceBy({
            items: {
                '0xffff': { address, amount: 1 },
                '0xfff0': { address, amount: 2 },
                '0xff00': { address, amount: 3 },
                '0xf000': { address, amount: 3 },
                '0x0000': { address, amount: 3 }
            }
        }, { address, amount: 3 }, 2);
        expect(nonce).toEqual('0x0000');
    });
});
