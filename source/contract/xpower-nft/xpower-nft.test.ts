import { XPowerNft } from './xpower-nft';

describe('XPowerNft', () => {
    it('should be constructible', () => {
        const xpower_nft = new XPowerNft('0x0');
        expect(xpower_nft).toBeDefined();
    });
});
