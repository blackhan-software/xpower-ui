import { nonceReducer } from './nonce-reducer';

import { addNonce } from '../actions';
import { removeNonce } from '../actions';
import { removeNonceByAmount } from '../actions';
import { removeNonces } from '../actions/nonce-actions';
import { Nonces, Empty } from '../types';

describe('Store w/nonceReducer', () => {
    const address = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    it('should add a nonce', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = nonceReducer(state_0, addNonce(0xffff, {
            address, block_hash, amount: 1n
        }));
        expect(state_1.items[0xffff]).toEqual({
            address, block_hash, amount: 1n
        });
        expect(state_1.more).toEqual([0xffff]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should remove a nonce', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = nonceReducer(state_0, addNonce(0xffff, {
            address, block_hash, amount: 1n
        }));
        expect(state_1.items[0xffff]).toEqual({
            address, block_hash, amount: 1n
        });
        expect(state_1.more).toEqual([0xffff]);
        expect(state_1.less).not.toBeDefined();
        const state_2 = nonceReducer(state_1, removeNonce(0xffff, {
            address, block_hash
        }));
        expect(state_2.items[0xffff]).not.toBeDefined();
        expect(state_2.less).toEqual([0xffff]);
        expect(state_2.more).not.toBeDefined();
    });
    it('should remove a nonce by amount', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = nonceReducer(state_0, addNonce(0xffff, {
            address, block_hash, amount: 1n
        }));
        expect(state_1.items[0xffff]).toEqual({
            address, block_hash, amount: 1n
        });
        expect(state_1.more).toEqual([0xffff]);
        expect(state_1.less).not.toBeDefined();
        const state_2 = nonceReducer(state_1, removeNonceByAmount({
            address, block_hash, amount: 1n
        }));
        expect(state_2.items[0xffff]).not.toBeDefined();
        expect(state_2.less).toEqual([0xffff]);
        expect(state_2.more).not.toBeDefined();
    });
    it('should remove all nonces', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = nonceReducer(state_0, addNonce(0xffff1, {
            address, block_hash, amount: 1n
        }));
        expect(state_1.items[0xffff1]).toEqual({
            address, block_hash, amount: 1n
        });
        expect(state_1.more).toEqual([0xffff1]);
        expect(state_1.less).not.toBeDefined();
        const state_2 = nonceReducer(state_1, addNonce(0xffff2, {
            address, block_hash, amount: 3n
        }));
        expect(state_2.items[0xffff2]).toEqual({
            address, block_hash, amount: 3n
        });
        expect(state_2.more).toEqual([0xffff2]);
        expect(state_2.less).not.toBeDefined();
        const state_3 = nonceReducer(state_2, removeNonces({
            address: null
        }));
        expect(state_3.items[0xffff1]).not.toBeDefined();
        expect(state_3.items[0xffff2]).not.toBeDefined();
        expect(state_3.less).toEqual([0xffff1, 0xffff2]);
        expect(state_3.more).not.toBeDefined();
    });
    it('should remove all nonces (by address)', () => {
        const address_1 = BigInt('0xabcd1');
        const address_2 = BigInt('0xabcd2');
        const state_0 = Empty<Nonces>();
        const state_1 = nonceReducer(state_0, addNonce(0xffff1, {
            address: address_1, block_hash, amount: 1n
        }));
        expect(state_1.items[0xffff1]).toEqual({
            address: address_1, block_hash, amount: 1n
        });
        expect(state_1.more).toEqual([0xffff1]);
        expect(state_1.less).not.toBeDefined();
        const state_2 = nonceReducer(state_1, addNonce(0xffff2, {
            address: address_2, block_hash, amount: 3n
        }));
        expect(state_2.items[0xffff2]).toEqual({
            address: address_2, block_hash, amount: 3n
        });
        expect(state_2.more).toEqual([0xffff2]);
        expect(state_2.less).not.toBeDefined();
        const state_3 = nonceReducer(state_2, removeNonces({
            address: address_1
        }));
        expect(state_3.items[0xffff1]).not.toBeDefined();
        expect(state_3.items[0xffff2]).toBeDefined();
        expect(state_3.less).toEqual([0xffff1]);
        expect(state_3.more).not.toBeDefined();
        const state_4 = nonceReducer(state_3, removeNonces({
            address: address_2
        }));
        expect(state_4.items[0xffff1]).not.toBeDefined();
        expect(state_4.items[0xffff2]).not.toBeDefined();
        expect(state_4.less).toEqual([0xffff2]);
        expect(state_4.more).not.toBeDefined();
    });
});
