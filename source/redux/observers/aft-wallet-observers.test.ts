import { Action, configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store } from 'redux';
import { aftWalletReducer } from '../reducers';

import { onAftWalletDecreased, onAftWalletIncreased } from '.';
import { decreaseAftWallet, increaseAftWallet } from '../actions';
import { State, Token } from '../types';

describe('onAftWalletIncreased', () => {
    const token = Token.THOR;
    it('should invoke handler (for increaseAftWallet)', () => {
        const reducer = combineReducers({
            aft_wallet: aftWalletReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onAftWalletIncreased(store as Store<State, Action>, (t, i) => {
            expect(t).toEqual(Token.THOR);
            expect(i.amount).toEqual(1n);
            expect(i.supply).toEqual(2n);
        });
        store.dispatch(increaseAftWallet(token, {
            amount: 1n, supply: 2n
        }));
    });
});
describe('onAftWalletDecreased', () => {
    const token = Token.LOKI;
    it('should invoke handler (for decreaseAftWallet)', () => {
        const reducer = combineReducers({
            aft_wallet: aftWalletReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onAftWalletDecreased(store as Store<State, Action>, (t, i) => {
            expect(t).toEqual(Token.LOKI);
            expect(i.amount).toEqual(1n);
            expect(i.supply).toEqual(3n);
        });
        store.dispatch(increaseAftWallet(token, {
            amount: 2n, supply: 3n
        }));
        store.dispatch(decreaseAftWallet(token, {
            amount: 1n
        }));
    });
});
