import { miningReducer } from './mining-reducer';
import { setMining } from '../actions';
import { MinerStatus } from '../types';

describe('Store w/mining-reducer', () => {
    it('should set-mining [status]', () => {
        const state_0 = { status: null, speed: 0.0 };
        const state_1 = miningReducer(state_0, setMining({
            status: MinerStatus.initialized
        }));
        expect(state_1.status).not.toEqual(null);
        expect(state_1.speed).toEqual(0.0);
    });
    it('should set-mining [speed]', () => {
        const state_0 = { status: null, speed: 0.0 };
        const state_1 = miningReducer(state_0, setMining({
            speed: 0.5
        }));
        expect(state_1.status).toEqual(null);
        expect(state_1.speed).toEqual(0.5);
    });
});
