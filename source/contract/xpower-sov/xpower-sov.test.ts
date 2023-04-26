import XPowerSov from './xpower-sov';

describe('XPowerSov', () => {
    it('should be constructible', () => {
        const xpower_sov = new XPowerSov('0x0');
        expect(xpower_sov).toBeDefined();
    })
});
