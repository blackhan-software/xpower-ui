import { total } from './total';

describe('total', () => {
    const address = '0xabcd';
    it('should sum to 0', () => {
        const sum = total({ items: {} }, {
            address
        });
        expect(sum).toEqual(0);
    });
    it('should sum to 1', () => {
        const sum = total({
            items: {
                '0xffff': { address, amount: 1 }
            }
        }, { address });
        expect(sum).toEqual(1);
    });
    it('should sum to 3', () => {
        const sum = total({
            items: {
                '0xffff': { address, amount: 1 },
                '0xfff0': { address, amount: 2 },
            }
        }, { address });
        expect(sum).toEqual(3);
    });
    it('should sum to 6', () => {
        const sum = total({
            items: {
                '0xffff': { address, amount: 1 },
                '0xfff0': { address, amount: 2 },
                '0xff00': { address, amount: 3 }
            }
        }, { address });
        expect(sum).toEqual(6);
    });
});
