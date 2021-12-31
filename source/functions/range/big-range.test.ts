import { big_range } from './big-range';

describe('big-range', () => {
    it('should return a range of [0..10)', () => {
        let j = 0n;
        for (const i of big_range(0, 10)) {
            expect(i).toEqual(j++);
        }
    });
    it('should return a range of [0..10)', () => {
        const array = Array.from(big_range(10));
        expect(array.length).toEqual(10);
        expect(array[0]).toEqual(0n);
        expect(array[9]).toEqual(9n);
    });
});
