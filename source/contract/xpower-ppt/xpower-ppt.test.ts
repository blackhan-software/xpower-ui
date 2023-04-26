import { XPowerPpt } from './xpower-ppt';

describe('XPowerPpt', () => {
    it('should be constructible', () => {
        const xpower_nft = new XPowerPpt('0x0');
        expect(xpower_nft).toBeDefined();
    });
});
