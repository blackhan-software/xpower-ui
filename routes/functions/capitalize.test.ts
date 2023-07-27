/* eslint @typescript-eslint/no-explicit-any: [off] */
import { capitalizeAll } from './capitalize';
import { capitalize } from './capitalize';

describe('capitalize w/length=1', () => {
    it('should capitalize "xpow token"', () => {
        expect(capitalize('xpow token')).toEqual('Xpow token');
    });
    it('should capitalize "XPOW TOKEN"', () => {
        expect(capitalize('XPOW TOKEN')).toEqual('XPOW TOKEN');
    });
    it('should capitalize "XPow Token"', () => {
        expect(capitalize('XPow Token')).toEqual('XPow Token');
    });
});
describe('capitalize w/length=2', () => {
    it('should capitalize "xpow token"', () => {
        expect(capitalize('xpow token', 2)).toEqual('XPow token');
    });
    it('should capitalize "XPOW TOKEN"', () => {
        expect(capitalize('XPOW TOKEN', 2)).toEqual('XPOW TOKEN');
    });
    it('should capitalize "XPow Token"', () => {
        expect(capitalize('XPow Token', 2)).toEqual('XPow Token');
    });
});
describe('capitalize-all w/length=1', () => {
    it('should capitalize-all "xpow token"', () => {
        expect(capitalizeAll('xpow token')).toEqual('Xpow Token');
    });
    it('should capitalize "XPOW TOKEN"', () => {
        expect(capitalizeAll('XPOW TOKEN')).toEqual('XPOW TOKEN');
    });
    it('should capitalize "XPow Token"', () => {
        expect(capitalizeAll('XPow Token')).toEqual('XPow Token');
    });
});
describe('capitalize-all w/length=2', () => {
    it('should capitalize-all "xpow token"', () => {
        expect(capitalizeAll('xpow token', 2)).toEqual('XPow TOken');
    });
    it('should capitalize "XPOW TOKEN"', () => {
        expect(capitalizeAll('XPOW TOKEN', 2)).toEqual('XPOW TOKEN');
    });
    it('should capitalize "XPow Token"', () => {
        expect(capitalizeAll('XPow Token', 2)).toEqual('XPow TOken');
    });
});
