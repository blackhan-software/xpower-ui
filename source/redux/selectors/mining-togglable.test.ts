import { miningState } from '../reducers';
import { miningTogglable } from './mining-togglable';

describe('togglable', () => {
    it('should return false [speed==0]', () => {
        const { speed } = miningState(0);
        expect(miningTogglable({ speed })).toEqual(false);
    });
    it('should return true [speed!=0]', () => {
        const { speed } = miningState(1);
        expect(miningTogglable({ speed })).toEqual(true);
    });
});
