import XPowerSov from './xpower-sov';

describe('XPowerSov', () => {
    it('should be constructible', () => {
        const address = '0x04e61318095bcac3b4F186469598bd4dCCb23621';
        const xpower_sov = new XPowerSov(address);
        expect(xpower_sov).toBeDefined();
    })
});
