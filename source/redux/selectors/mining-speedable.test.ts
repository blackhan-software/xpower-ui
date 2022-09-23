import { MinerStatus } from '../types';
import { miningSpeedable } from './mining-speedable';

describe('speedable', () => {
    it('should return false [status==null]', () => {
        expect(miningSpeedable({ status: null })).toEqual(false);
    });
    it('should return false [status==starting]', () => {
        expect(miningSpeedable({ status: MinerStatus.starting })).toEqual(false);
    });
    it('should return false [status==started]', () => {
        expect(miningSpeedable({ status: MinerStatus.started })).toEqual(false);
    });
    it('should return false [status==stopping]', () => {
        expect(miningSpeedable({ status: MinerStatus.stopping })).toEqual(false);
    });
    it('should return true [status==stopped]', () => {
        expect(miningSpeedable({ status: MinerStatus.stopped })).toEqual(true);
    });
});
