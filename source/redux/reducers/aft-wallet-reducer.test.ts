/* eslint @typescript-eslint/no-explicit-any: [off] */
import { aftWalletReducer } from './aft-wallet-reducer';

import { increaseAftWallet, decreaseAftWallet, setAftWallet } from '../actions';
import { Empty, Token, AftWallet } from '../types';

describe('Store w/aft-wallet-reducer (set)', () => {
    const t = Token.XPOW;
    it('should set-aft-wallet to amount=1', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, setAftWallet(t, {
            amount: 1n, supply: 1n, collat: 0n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should set-aft-wallet to amount=2', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, setAftWallet(t, {
            amount: 2n, supply: 5n, collat: 0n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 2n, supply: 5n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
});
describe('Store w/aft-wallet-reducer (inrease)', () => {
    const t = Token.XPOW;
    it('should inc-aft-wallet by amount=1 (w/rel. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should inc-aft-wallet by amount=1 (w/abs. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 10n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should *not* inc-aft-wallet by amount=1 (w/abs. supply)', () => {
        const state_0 = Empty<AftWallet>();
        let state_1;
        try {
            state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
                amount: 2n, supply: 1n
            }));
        } catch (ex: any) {
            expect(ex.message).toBe(`${t} supply=1 < amount=2`)
        }
        expect(state_1).not.toBeDefined();
    });
    it('should inc-aft-wallet by amount=2 (w/1st:rel. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n, collat: 0n
        });
        const state_2 = aftWalletReducer(state_1, increaseAftWallet(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 3n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should inc-aft-wallet by amount=2 (w/1st:abs. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 10n, collat: 0n
        });
        const state_2 = aftWalletReducer(state_1, increaseAftWallet(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 12n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should inc-aft-wallet by amount=2 (w/1st:rel. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n, collat: 0n
        });
        const state_2 = aftWalletReducer(state_1, increaseAftWallet(t, {
            amount: 2n, supply: 20n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 20n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should inc-aft-wallet by amount=2 (w/1st:abs. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 10n, collat: 0n
        });
        const state_2 = aftWalletReducer(state_1, increaseAftWallet(t, {
            amount: 2n, supply: 20n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 20n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
});
describe('Store w/aft-wallet-reducer (decrease)', () => {
    const t = Token.XPOW;
    it('should dec-aft-wallet by amount=1 (w/rel. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n, collat: 0n
        });
        const state_2 = aftWalletReducer(state_1, decreaseAftWallet(t, {
            amount: 1n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 0n, supply: 1n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
    });
    it('should dec-aft-wallet by amount=1 (w/abs. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n, collat: 0n
        });
        const state_2 = aftWalletReducer(state_1, decreaseAftWallet(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 0n, supply: 10n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
    });
    it('should *not* dec-aft-wallet by amount=1 (w/abs. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 5n
        }));
        let state_2;
        try {
            state_2 = aftWalletReducer(state_1, decreaseAftWallet(t, {
                amount: 2n, supply: 1n
            }));
        } catch (ex: any) {
            expect(ex.message).toBe(`${t} supply=1 < amount=3`)
        }
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2).not.toBeDefined();
    });
    it('should dec-aft-wallet by amount=2 (w/1st:rel. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n, collat: 0n
        });
        const state_2 = aftWalletReducer(state_1, decreaseAftWallet(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 5n, collat: 0n
        });
        const state_3 = aftWalletReducer(state_2, decreaseAftWallet(t, {
            amount: 1n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 5n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
    it('should dec-aft-wallet by amount=2 (w/1st:abs. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n, collat: 0n
        });
        const state_2 = aftWalletReducer(state_1, decreaseAftWallet(t, {
            amount: 2n, supply: 4n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 4n, collat: 0n
        });
        const state_3 = aftWalletReducer(state_2, decreaseAftWallet(t, {
            amount: 1n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 4n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
    it('should dec-aft-wallet by amount=2 (w/1st:rel. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n, collat: 0n
        });
        const state_2 = aftWalletReducer(state_1, decreaseAftWallet(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 5n, collat: 0n
        });
        const state_3 = aftWalletReducer(state_2, decreaseAftWallet(t, {
            amount: 1n, supply: 4n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 4n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
    it('should dec-aft-wallet by amount=2 (w/1st:abs. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<AftWallet>();
        const state_1 = aftWalletReducer(state_0, increaseAftWallet(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n, collat: 0n
        });
        const state_2 = aftWalletReducer(state_1, decreaseAftWallet(t, {
            amount: 2n, supply: 4n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 4n, collat: 0n
        });
        const state_3 = aftWalletReducer(state_2, decreaseAftWallet(t, {
            amount: 1n, supply: 3n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 3n, collat: 0n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
});
