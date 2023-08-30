/**
 * @jest-environment jsdom
 */
import { Miner } from '.';

describe('Miner', () => {
    const contract = '0xD8a5a9b31c3C0232E196d518E89Fd8bF83AcAd43';
    const account = '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC';
    it('should be constructible', () => {
        const miner = new Miner(contract, BigInt(account));
        expect(miner).toBeDefined();
    });
    it('should start & stop mining', async () => {
        const miner = new Miner(contract, BigInt(account));
        expect(miner).toBeDefined();
        await miner.start(0n, async ({ nonce, amount, worker }) => {
            expect(nonce).toMatch(/^0x[a-f0-9]+/);
            expect(amount).toBeGreaterThan(0n);
            expect(worker).toBeGreaterThanOrEqual(0);
            await miner.stop();
            expect(miner.running).toBeFalsy();
        });
    }, 15_000);
});
