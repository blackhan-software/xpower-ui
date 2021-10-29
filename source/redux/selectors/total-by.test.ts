import { totalBy } from './total-by';

describe('total', () => {
    const address = '0xabcd';
    it('should sum to 0', () => {
        const sum = totalBy({ items: {} }, {
            address, amount: 0
        });
        expect(sum).toEqual(0);
    });
    it('should sum to 1', () => {
        const sum = totalBy({
            items: { '0xffff': { address, amount: 1 } }
        }, {
            address, amount: 1
        });
        expect(sum).toEqual(1);
    });
    it('should sum to 2', () => {
        const sum = totalBy({
            items: {
                '0xffff': { address, amount: 1 },
                '0xfff0': { address, amount: 2 }
            }
        }, {
            address, amount: 2
        });
        expect(sum).toEqual(2);
    });
    it('should sum to 3', () => {
        const sum = totalBy({
            items: {
                '0xffff': { address, amount: 1 },
                '0xfff0': { address, amount: 2 },
                '0xff00': { address, amount: 3 }
            }
        }, {
            address, amount: 3
        });
        expect(sum).toEqual(3);
    });
});
