import { miningTogglable } from './mining-togglable';

describe('togglable', () => {
    it('should return false [speed==0]', () => {
        expect(miningTogglable({ speed: 0 })).toEqual(false);
    });
    it('should return true [speed!=0]', () => {
        expect(miningTogglable({ speed: 1 })).toEqual(true);
    });
});
