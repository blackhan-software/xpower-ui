/**
 * @jest-environment jsdom
 */
import { TokenSymbol } from '../token';
import { Miner } from '.';

describe('Miner', () => {
    const address = BigInt('0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC');
    it('should be constructible', () => {
        const miner = new Miner(TokenSymbol.GPU, address);
        expect(miner).toBeDefined();
    });
    it('should start & stop minining', () => {
        const miner = new Miner(TokenSymbol.GPU, address);
        expect(miner).toBeDefined();
        miner.start(0n, (nonce, amount) => {
            expect(miner.running).toBeTruthy();
            expect(nonce.toString(16)).toMatch(/^0x/);
            expect(amount.toString(16)).toMatch(/^0x/);
            miner.stop();
            expect(miner.running).toBeFalsy();
        })
    })
});
