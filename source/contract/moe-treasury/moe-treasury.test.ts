import MoeTreasury from './moe-treasury';

describe('MoeTreasury', () => {
    it('should be constructible', () => {
        const xpower = new MoeTreasury('0x0');
        expect(xpower).toBeDefined();
    })
});
