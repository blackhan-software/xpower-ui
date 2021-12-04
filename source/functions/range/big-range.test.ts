import { big_range } from './big-range';

describe('big-range', () => {
    it('should return a range of [0..10)', () => {
        let j = 0;
        for (const i of big_range(0, 10)) {
            expect(i.toNumber()).toEqual(j++);
        }
    });
    it('should return a range of [0..10)', () => {
        const array = Array.from(big_range(10));
        expect(array.length).toEqual(10);
        expect(array[0].toNumber()).toEqual(0);
        expect(array[9].toNumber()).toEqual(9);
    });
});
