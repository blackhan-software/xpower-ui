/**
 * @jest-environment jsdom
 */
import { HashManager, Slot } from './hash-manager';

import { Token } from '../redux/types';
import { Version } from '../types';

describe('HashManager', () => {
    const slot = { token: Token.XPOW, version: Version.v05c } as Slot;
    const block_hash = BigInt('0xb10c');
    it('should set time for block-hash', () => {
        HashManager.set(block_hash, 1n, slot);
        const latest_hash = HashManager.latestHash(slot);
        expect(latest_hash).toEqual(block_hash);
        const latest_time = HashManager.latestTime(slot);
        expect(latest_time).toEqual(1n);
    });
    it('should get time for block-hash (for XPOW slot)', () => {
        const time = HashManager.get(block_hash, slot);
        expect(time).toEqual(1n);
    });
});
