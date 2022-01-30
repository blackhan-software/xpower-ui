import { Miner } from '.';

describe('Miner', () => {
    const address = '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC';
    it('should be constructible', () => {
        const miner = new Miner(address);
        expect(miner).toBeDefined();
    });
    it('should start & stop minining', () => {
        const miner = new Miner(address);
        expect(miner).toBeDefined();
        miner.start((nonce, amount) => {
            expect(miner.running).toBeTruthy();
            expect(nonce.toHexString()).toMatch(/^0x/);
            expect(amount.toHexString()).toMatch(/^0x/);
            miner.stop();
            expect(miner.running).toBeFalsy();
        })
    })
});