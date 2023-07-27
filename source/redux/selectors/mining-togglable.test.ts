import { miningState } from '../reducers';
import { Token } from '../types';
import { miningTogglable } from './mining-togglable';

describe('togglable', () => {
    it('should return false [speed==0]', () => {
        const { speed } = miningState(); speed.XPOW = 0;
        expect(miningTogglable({ speed }, Token.XPOW)).toEqual(false);
    });
    it('should return true [speed!=0]', () => {
        const { speed } = miningState(); speed.XPOW = 1;
        expect(miningTogglable({ speed }, Token.XPOW)).toEqual(true);
    });
});
