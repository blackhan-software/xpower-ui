import { noncesReducer } from './nonces-reducer';

import { addNonce } from '../actions';
import { removeNonce } from '../actions';
import { removeNonceByAmount } from '../actions';
import { removeNonces } from '../actions/nonces-actions';
import { Nonces, Empty, Token } from '../types';

describe('Store w/nonces-reducer', () => {
    const account = BigInt('0xabcd');
    const block_hash = BigInt('0xb10c');
    const token = Token.XPOW;
    it('should add a nonce', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = noncesReducer(state_0, addNonce('0xffff', {
            account, amount: 1n, block_hash, token, worker: 0
        }));
        expect(state_1.items['0xffff']).toEqual({
            account, amount: 1n, block_hash, token, worker: 0
        });
        expect(state_1.more).toEqual(['0xffff']);
        expect(state_1.less).not.toBeDefined();
    });
    it('should remove a nonce', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = noncesReducer(state_0, addNonce('0xffff', {
            account, amount: 1n, block_hash, token, worker: 0
        }));
        expect(state_1.items['0xffff']).toEqual({
            account, amount: 1n, block_hash, token, worker: 0
        });
        expect(state_1.more).toEqual(['0xffff']);
        expect(state_1.less).not.toBeDefined();
        const state_2 = noncesReducer(state_1, removeNonce('0xffff', {
            account, block_hash, token
        }));
        expect(state_2.items['0xffff']).not.toBeDefined();
        expect(state_2.less).toEqual(['0xffff']);
        expect(state_2.more).not.toBeDefined();
    });
    it('should remove a nonce by amount', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = noncesReducer(state_0, addNonce('0xffff', {
            account, amount: 1n, block_hash, token, worker: 0
        }));
        expect(state_1.items['0xffff']).toEqual({
            account, amount: 1n, block_hash, token, worker: 0
        });
        expect(state_1.more).toEqual(['0xffff']);
        expect(state_1.less).not.toBeDefined();
        const state_2 = noncesReducer(state_1, removeNonceByAmount({
            account, amount: 1n, block_hash, token
        }));
        expect(state_2.items['0xffff']).not.toBeDefined();
        expect(state_2.less).toEqual(['0xffff']);
        expect(state_2.more).not.toBeDefined();
    });
    it('should remove all nonces', () => {
        const state_0 = Empty<Nonces>();
        const state_1 = noncesReducer(state_0, addNonce('0xfff1', {
            account, amount: 1n, block_hash, token, worker: 0
        }));
        expect(state_1.items['0xfff1']).toEqual({
            account, amount: 1n, block_hash, token, worker: 0
        });
        expect(state_1.more).toEqual(['0xfff1']);
        expect(state_1.less).not.toBeDefined();
        const state_2 = noncesReducer(state_1, addNonce('0xfff2', {
            account, amount: 3n, block_hash, token, worker: 0
        }));
        expect(state_2.items['0xfff2']).toEqual({
            account, amount: 3n, block_hash, token, worker: 0
        });
        expect(state_2.more).toEqual(['0xfff2']);
        expect(state_2.less).not.toBeDefined();
        const state_3 = noncesReducer(state_2, removeNonces({
            account: null, token
        }));
        expect(state_3.items['0xfff1']).not.toBeDefined();
        expect(state_3.items['0xfff2']).not.toBeDefined();
        expect(state_3.less).toEqual(['0xfff1', '0xfff2']);
        expect(state_3.more).not.toBeDefined();
    });
    it('should remove all nonces (by account)', () => {
        const account_1 = BigInt('0xabcd1');
        const account_2 = BigInt('0xabcd2');
        const state_0 = Empty<Nonces>();
        const state_1 = noncesReducer(state_0, addNonce('0xfff1', {
            account: account_1, block_hash, amount: 1n, token, worker: 0
        }));
        expect(state_1.items['0xfff1']).toEqual({
            account: account_1, block_hash, amount: 1n, token, worker: 0
        });
        expect(state_1.more).toEqual(['0xfff1']);
        expect(state_1.less).not.toBeDefined();
        const state_2 = noncesReducer(state_1, addNonce('0xfff2', {
            account: account_2, block_hash, amount: 3n, token, worker: 0
        }));
        expect(state_2.items['0xfff2']).toEqual({
            account: account_2, block_hash, amount: 3n, token, worker: 0
        });
        expect(state_2.more).toEqual(['0xfff2']);
        expect(state_2.less).not.toBeDefined();
        const state_3 = noncesReducer(state_2, removeNonces({
            account: account_1, token
        }));
        expect(state_3.items['0xfff1']).not.toBeDefined();
        expect(state_3.items['0xfff2']).toBeDefined();
        expect(state_3.less).toEqual(['0xfff1']);
        expect(state_3.more).not.toBeDefined();
        const state_4 = noncesReducer(state_3, removeNonces({
            account: account_2, token
        }));
        expect(state_4.items['0xfff1']).not.toBeDefined();
        expect(state_4.items['0xfff2']).not.toBeDefined();
        expect(state_4.less).toEqual(['0xfff2']);
        expect(state_4.more).not.toBeDefined();
    });
});
