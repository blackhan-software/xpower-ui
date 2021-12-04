import XPowerNft from './xpower-nft';

describe('XPowerNft', () => {
    it('should be constructible', () => {
        const address = '0x55a4eDd8A2c051079b426E9fbdEe285368824a89';
        const xpower_nft = new XPowerNft(address);
        expect(xpower_nft).toBeDefined();
    })
});
