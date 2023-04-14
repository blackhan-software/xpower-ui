import { range } from './range';

describe('range', () => {
    it('should return a range of [0..10)', () => {
        let j = 0;
        for (const i of range(0, 10, 1)) {
            expect(i).toEqual(j++);
        }
    });
    it('should return a range of [0..10)', () => {
        const array = Array.from(range(10));
        expect(array.length).toEqual(10);
        expect(array[0]).toEqual(0);
        expect(array[9]).toEqual(9);
    });
});
