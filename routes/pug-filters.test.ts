import filters from './pug-filters';

describe('trim', () => {
    it('should trim white space', () => {
        expect(filters.trim(' abc ')).toEqual('abc');
    });
    it('should trim leading white space', () => {
        expect(filters.trim(' abc')).toEqual('abc');
    });
    it('should trim trailing white space', () => {
        expect(filters.trim('abc ')).toEqual('abc');
    });
});
describe('nice', () => {
    it('should return a number w/decimal separator(s)', () => {
        expect(filters.nice(1000000)).toEqual("1'000'000");
        expect(filters.nice(100000)).toEqual("100'000");
        expect(filters.nice(10000)).toEqual("10'000");
        expect(filters.nice(1000)).toEqual("1'000");
        expect(filters.nice(100)).toEqual("100");
        expect(filters.nice(10)).toEqual("10");
        expect(filters.nice(1)).toEqual("1");
    });
});