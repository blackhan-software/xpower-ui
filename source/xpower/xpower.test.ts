import XPower from './xpower';

describe('XPower', () => {
    it('should be constructible', () => {
        const address = '0x52C84043CD9c865236f11d9Fc9F56aa003c1f922';
        const xpower = new XPower(address);
        expect(xpower).toBeDefined();
    })
});
