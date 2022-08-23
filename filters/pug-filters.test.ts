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
    it('should return a number w/decimal separators', () => {
        expect(filters.nice(1_234_567.890)).toEqual("1'234'567.89");
        expect(filters.nice(123_456.789)).toEqual("123'456.789");
        expect(filters.nice(12_345.678)).toEqual("12'345.678");
        expect(filters.nice(1_234.567)).toEqual("1'234.567");
        expect(filters.nice(123.456)).toEqual("123.456");
        expect(filters.nice(12.345)).toEqual("12.345");
        expect(filters.nice(1.234)).toEqual("1.234");
    });
    it('should return a number w/decimal separators', () => {
        expect(filters.nice(1_234_567n)).toEqual("1'234'567");
        expect(filters.nice(123_456n)).toEqual("123'456");
        expect(filters.nice(12_345n)).toEqual("12'345");
        expect(filters.nice(1_234n)).toEqual("1'234");
        expect(filters.nice(123n)).toEqual("123");
        expect(filters.nice(12n)).toEqual("12");
        expect(filters.nice(1n)).toEqual("1");
    });
    it('should return a number w/decimal separators', () => {
        expect(filters.nice(1_000_000)).toEqual("1'000'000");
        expect(filters.nice(100_000)).toEqual("100'000");
        expect(filters.nice(10_000)).toEqual("10'000");
        expect(filters.nice(1_000)).toEqual("1'000");
        expect(filters.nice(100)).toEqual("100");
        expect(filters.nice(10)).toEqual("10");
        expect(filters.nice(1)).toEqual("1");
    });
});
describe('nice_si', () => {
    it('should return a number w/si suffixes', () => {
        expect(filters.nice_si(1_234_567.890)).toEqual("1.234M");
        expect(filters.nice_si(123_456.789)).toEqual("123.456K");
        expect(filters.nice_si(12_345.678)).toEqual("12.345K");
        expect(filters.nice_si(1_234.567)).toEqual("1.234K");
        expect(filters.nice_si(123.456)).toEqual("123.456");
        expect(filters.nice_si(12.345)).toEqual("12.345");
        expect(filters.nice_si(1.234)).toEqual("1.234");
    });
    it('should return a number w/si suffixes', () => {
        expect(filters.nice_si(1_234_567n)).toEqual("1.234M");
        expect(filters.nice_si(123_456n)).toEqual("123.456K");
        expect(filters.nice_si(12_345n)).toEqual("12.345K");
        expect(filters.nice_si(1_234n)).toEqual("1.234K");
        expect(filters.nice_si(123n)).toEqual("123");
        expect(filters.nice_si(12n)).toEqual("12");
        expect(filters.nice_si(1n)).toEqual("1");
    });
    it('should return a number w/si suffixes', () => {
        expect(filters.nice_si(1_000_000)).toEqual("1M");
        expect(filters.nice_si(100_000)).toEqual("100K");
        expect(filters.nice_si(10_000)).toEqual("10K");
        expect(filters.nice_si(1_000)).toEqual("1K");
        expect(filters.nice_si(100)).toEqual("100");
        expect(filters.nice_si(10)).toEqual("10");
        expect(filters.nice_si(1)).toEqual("1");
    });
});
