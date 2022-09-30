/* eslint @typescript-eslint/no-explicit-any: [off] */
import { walletReducer } from './wallet-reducer';

import { increaseWallet, decreaseWallet, setWallet } from '../actions';
import { Empty, Token, Wallet } from '../types';

describe('Store w/wallet-reducer (set)', () => {
    const t = Token.THOR;
    it('should set-wallet to amount=1', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, setWallet(t, {
            amount: 1n, supply: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should set-wallet to amount=2', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, setWallet(t, {
            amount: 2n, supply: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 2n, supply: 5n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
});
describe('Store w/wallet-reducer (inrease)', () => {
    const t = Token.LOKI;
    it('should inc-wallet by amount=1 (w/rel. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should inc-wallet by amount=1 (w/abs. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 10n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should *not* inc-wallet by amount=1 (w/abs. supply)', () => {
        const state_0 = Empty<Wallet>();
        let state_1;
        try {
            state_1 = walletReducer(state_0, increaseWallet(t, {
                amount: 2n, supply: 1n
            }));
        } catch (ex: any) {
            expect(ex.message).toBe(`${t} supply=1 < amount=2`)
        }
        expect(state_1).not.toBeDefined();
    });
    it('should inc-wallet by amount=2 (w/1st:rel. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = walletReducer(state_1, increaseWallet(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 3n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should inc-wallet by amount=2 (w/1st:abs. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 10n
        });
        const state_2 = walletReducer(state_1, increaseWallet(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 12n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should inc-wallet by amount=2 (w/1st:rel. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = walletReducer(state_1, increaseWallet(t, {
            amount: 2n, supply: 20n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 20n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should inc-wallet by amount=2 (w/1st:abs. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 10n
        });
        const state_2 = walletReducer(state_1, increaseWallet(t, {
            amount: 2n, supply: 20n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 20n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([t]);
        expect(state_2.less).not.toBeDefined();
    });
});
describe('Store w/wallet-reducer (decrease)', () => {
    const t = Token.ODIN;
    it('should dec-wallet by amount=1 (w/rel. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = walletReducer(state_1, decreaseWallet(t, {
            amount: 1n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 0n, supply: 1n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
    });
    it('should dec-wallet by amount=1 (w/abs. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 1n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = walletReducer(state_1, decreaseWallet(t, {
            amount: 1n, supply: 10n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 0n, supply: 10n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
    });
    it('should *not* dec-wallet by amount=1 (w/abs. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 5n
        }));
        let state_2;
        try {
            state_2 = walletReducer(state_1, decreaseWallet(t, {
                amount: 2n, supply: 1n
            }));
        } catch (ex: any) {
            expect(ex.message).toBe(`${t} supply=1 < amount=3`)
        }
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2).not.toBeDefined();
    });
    it('should dec-wallet by amount=2 (w/1st:rel. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = walletReducer(state_1, decreaseWallet(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 5n
        });
        const state_3 = walletReducer(state_2, decreaseWallet(t, {
            amount: 1n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 5n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
    it('should dec-wallet by amount=2 (w/1st:abs. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = walletReducer(state_1, decreaseWallet(t, {
            amount: 2n, supply: 4n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 4n
        });
        const state_3 = walletReducer(state_2, decreaseWallet(t, {
            amount: 1n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 4n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
    it('should dec-wallet by amount=2 (w/1st:rel. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = walletReducer(state_1, decreaseWallet(t, {
            amount: 2n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 5n
        });
        const state_3 = walletReducer(state_2, decreaseWallet(t, {
            amount: 1n, supply: 4n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 4n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
    it('should dec-wallet by amount=2 (w/1st:abs. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Wallet>();
        const state_1 = walletReducer(state_0, increaseWallet(t, {
            amount: 5n
        }));
        expect(state_1.items[t]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = walletReducer(state_1, decreaseWallet(t, {
            amount: 2n, supply: 4n
        }));
        expect(state_2.items[t]).toEqual({
            amount: 3n, supply: 4n
        });
        const state_3 = walletReducer(state_2, decreaseWallet(t, {
            amount: 1n, supply: 3n
        }));
        expect(state_3.items[t]).toEqual({
            amount: 2n, supply: 3n
        });
        expect(state_1.more).toEqual([t]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([t]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([t]);
    });
});
