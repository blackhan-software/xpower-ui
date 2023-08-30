import { miningState } from '../reducers';
import { miningSpeedBy } from './mining-speed-by';

describe('mining-speed-by', () => {
    it('should return mining-speed by token', () => {
        const mining = miningState();
        const mining_speed = miningSpeedBy({ mining });
        expect(mining_speed).toEqual(mining.speed);
    });
});
