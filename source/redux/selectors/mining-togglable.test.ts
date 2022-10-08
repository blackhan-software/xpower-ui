import { miningState } from '../reducers';
import { Token } from '../types';
import { miningTogglable } from './mining-togglable';

describe('togglable', () => {
    it('should return false [speed==0]', () => {
        const { speed } = miningState(); speed.THOR = 0;
        expect(miningTogglable({ speed }, Token.THOR)).toEqual(false);
    });
    it('should return true [speed!=0]', () => {
        const { speed } = miningState(); speed.THOR = 1;
        expect(miningTogglable({ speed }, Token.THOR)).toEqual(true);
    });
});
