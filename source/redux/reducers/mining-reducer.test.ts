import { setMiningSpeed, setMiningStatus } from '../actions';
import { MinerStatus } from '../types';
import { miningReducer, miningState } from './mining-reducer';

describe('Store w/mining-reducer', () => {
    it('should set-mining [speed]', () => {
        const state_0 = miningState();
        const state_1 = miningReducer(state_0, setMiningSpeed({
            speed: 0.5
        }));
        expect(state_1.speed).toEqual(0.5);
    });
    it('should set-mining [status]', () => {
        const state_0 = miningState();
        const state_1 = miningReducer(state_0, setMiningStatus({
            status: MinerStatus.initialized
        }));
        expect(state_1.status).not.toEqual(null);
    });
});
