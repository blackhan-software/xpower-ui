import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store } from 'redux';
import { walletReducer } from '../reducers';

import { Action, increaseWallet, decreaseWallet } from '../actions';
import { onWalletIncreased, onWalledDecreased } from '.';
import { State, Token } from '../types';

describe('onWalletIncreased', () => {
    const token = Token.THOR;
    it('should invoke handler (for increaseWallet)', () => {
        const reducer = combineReducers({
            wallet: walletReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onWalletIncreased(store as Store<State, Action>, (t, i) => {
            expect(t).toEqual(Token.THOR);
            expect(i.amount).toEqual(1n);
            expect(i.supply).toEqual(2n);
        });
        store.dispatch(increaseWallet(token, {
            amount: 1n, supply: 2n
        }));
    });
});
describe('onWalletDecreased', () => {
    const token = Token.LOKI;
    it('should invoke handler (for decreaseWallet)', () => {
        const reducer = combineReducers({
            wallet: walletReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onWalledDecreased(store as Store<State, Action>, (t, i) => {
            expect(t).toEqual(Token.LOKI);
            expect(i.amount).toEqual(1n);
            expect(i.supply).toEqual(3n);
        });
        store.dispatch(increaseWallet(token, {
            amount: 2n, supply: 3n
        }));
        store.dispatch(decreaseWallet(token, {
            amount: 1n
        }));
    });
});
