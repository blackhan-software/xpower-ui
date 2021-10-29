import { in_range } from './in-range';
import { BigNumber } from 'ethers';

const zero = BigNumber.from(0);
const five = BigNumber.from(5);
const ten = BigNumber.from(10);

describe('in-range', () => {
    const range = { min: 0, max: 10 };
    it('should return true for 0 in [0..10)', () => {
        expect(in_range(zero, range)).toBeTruthy();
    });
    it('should return true for 5 in [0..10)', () => {
        expect(in_range(five, range)).toBeTruthy();
    });
    it('should return false for 10 in [0..10)', () => {
        expect(in_range(ten, range)).toBeFalsy();
    });
});
describe('in-range', () => {
    const range = { min: 10, max: 0 };
    it('should return false for 0 in [10..0)', () => {
        expect(in_range(zero, range)).toBeFalsy();
    });
    it('should return false for 5 in [10..0)', () => {
        expect(in_range(five, range)).toBeFalsy();
    });
    it('should return false for 10 in [10..0)', () => {
        expect(in_range(ten, range)).toBeFalsy();
    });
});
describe('in-range', () => {
    const range = { min: 0, max: Infinity };
    it('should return true for 0 in [0..Infinity)', () => {
        expect(in_range(zero, range)).toBeTruthy();
    });
    it('should return true for 5 in [0..Infinity)', () => {
        expect(in_range(five, range)).toBeTruthy();
    });
    it('should return true for 10 in [0..Infinity)', () => {
        expect(in_range(ten, range)).toBeTruthy();
    });
});
describe('in-range', () => {
    const range = { min: Infinity, max: 10 };
    it('should return false for 0 in [Infinity..10)', () => {
        expect(in_range(zero, range)).toBeFalsy();
    });
    it('should return false for 5 in [Infinity..10)', () => {
        expect(in_range(five, range)).toBeFalsy();
    });
    it('should return false for 10 in [Infinity..10)', () => {
        expect(in_range(ten, range)).toBeFalsy();
    });
});
describe('in-range', () => {
    const range = { min: Infinity, max: Infinity };
    it('should return false for 0 in [Infinity..Infinity)', () => {
        expect(in_range(zero, range)).toBeFalsy();
    });
    it('should return false for 5 in [Infinity..Infinity)', () => {
        expect(in_range(five, range)).toBeFalsy();
    });
    it('should return false for 10 in [Infinity..Infinity)', () => {
        expect(in_range(ten, range)).toBeFalsy();
    });
});
