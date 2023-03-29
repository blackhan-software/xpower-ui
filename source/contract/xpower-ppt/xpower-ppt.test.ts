import { address } from '../../../test/env-address';
import { XPowerPpt } from './xpower-ppt';

describe('XPowerPpt', () => {
    it('should be constructible', () => {
        const xpower_nft = new XPowerPpt(address({
            infix: 'PPT', token: 'XPOW'
        }));
        expect(xpower_nft).toBeDefined();
    });
});
