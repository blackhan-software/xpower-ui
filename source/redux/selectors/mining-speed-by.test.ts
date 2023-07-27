import { miningState } from '../reducers';
import { Token } from '../types';
import { miningSpeedBy } from './mining-speed-by';

describe('mining-speed-by', () => {
    it('should return mining-speed by token', () => {
        const [mining, token] = [miningState(), Token.XPOW];
        const mining_speed = miningSpeedBy({ mining }, token);
        expect(mining_speed).toEqual(mining.speed[token]);
    });
});
