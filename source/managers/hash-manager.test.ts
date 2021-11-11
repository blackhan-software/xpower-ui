/**
 * @jest-environment jsdom
 */
import { HashManager, Slot } from './hash-manager';

describe('HashManager', () => {
    const cpu_slot = { slot: 'cpu' } as Slot;
    const gpu_slot = { slot: 'gpu' } as Slot;
    it('should set time for block-hash', () => {
        HashManager.set('0x0000', 1, cpu_slot);
        const latest_hash = HashManager.latestHash(cpu_slot);
        expect(latest_hash).toEqual('0x0000');
        const latest_time = HashManager.latestTime(cpu_slot);
        expect(latest_time).toEqual(1);
    });
    it('should get time for block-hash (for CPU slot)', () => {
        const cpu_time = HashManager.get('0x0000', cpu_slot);
        expect(cpu_time).toEqual(1);
    });
    it('should *not* get time for block-hash (for GPU slot)', () => {
        const gpu_time = HashManager.get('0x0000', gpu_slot);
        expect(gpu_time).toEqual(null);
    });
});
