import { AnyAction, configureStore, Store } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { ratesUiReducer } from '../reducers';

import { onRatesUi, onRatesUiRefresher } from '.';
import { setRatesUi, setRatesUiRefresher } from '../actions';
import { AppState } from '../store';
import { NftToken, RefresherStatus } from '../types';

describe('onRatesUi', () => {
    it('should invoke handler (for setRatesUi)', () => {
        const reducer = combineReducers({
            rates_ui: ratesUiReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onRatesUi(store as Store<AppState, AnyAction>, ({ refresher }) => {
            expect(refresher[NftToken.XPOW]).toEqual({
                status: RefresherStatus.refreshed
            });
        });
        const refresher = {
            [NftToken.XPOW]: { status: RefresherStatus.refreshed },
        };
        store.dispatch(setRatesUi({ refresher }));
    });
    it('should invoke handler (for setRatesUiRefresher)', () => {
        const reducer = combineReducers({
            rates_ui: ratesUiReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onRatesUi(store as Store<AppState, AnyAction>, ({ refresher }) => {
            expect(refresher[NftToken.XPOW]).toEqual({
                status: null
            });
        });
        const refresher = {
            [NftToken.XPOW]: { status: null },
        };
        store.dispatch(setRatesUiRefresher({ refresher }));
    });
});
describe('onRatesUiRefresher', () => {
    it('should invoke handler (for setRatesUi)', () => {
        const reducer = combineReducers({
            rates_ui: ratesUiReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onRatesUiRefresher(store as Store<AppState, AnyAction>, (next) => {
            expect(next[NftToken.XPOW]).toEqual({
                status: RefresherStatus.refreshed
            });
        });
        const refresher = {
            [NftToken.XPOW]: { status: RefresherStatus.refreshed },
        };
        store.dispatch(setRatesUi({ refresher }));
    });
    it('should invoke handler (for setRatesUiRefresher)', () => {
        const reducer = combineReducers({
            rates_ui: ratesUiReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onRatesUiRefresher(store as Store<AppState, AnyAction>, (next) => {
            expect(next[NftToken.XPOW]).toEqual({
                status: null
            });
        });
        const refresher = {
            [NftToken.XPOW]: { status: null },
        };
        store.dispatch(setRatesUiRefresher({ refresher }));
    });
});
