import PptTreasury from './ppt-treasury';

describe('PptTreasury', () => {
    it('should be constructible', () => {
        const xpower = new PptTreasury('0x0');
        expect(xpower).toBeDefined();
    })
});
