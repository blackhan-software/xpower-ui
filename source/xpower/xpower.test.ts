import XPower from './xpower';

describe('XPower', () => {
    it('should be constructible', () => {
        const address = '0xa4DfF80B4a1D748BF28BC4A271eD834689Ea3407';
        const xpower = new XPower(address);
        expect(xpower).toBeDefined();
    })
});
