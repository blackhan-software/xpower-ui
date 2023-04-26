import XPowerMoe from './xpower-moe';

describe('XPowerMoe', () => {
    it('should be constructible', () => {
        const xpower_moe = new XPowerMoe('0x0');
        expect(xpower_moe).toBeDefined();
    })
});
