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
            expect(refresher[NftToken.THOR]).toEqual({
                status: RefresherStatus.refreshing
            });
            expect(refresher[NftToken.LOKI]).toEqual({
                status: RefresherStatus.refreshed
            });
            expect(refresher[NftToken.ODIN]).toEqual({
                status: RefresherStatus.refetch
            });
        });
        const refresher = {
            [NftToken.THOR]: { status: RefresherStatus.refreshing },
            [NftToken.LOKI]: { status: RefresherStatus.refreshed },
            [NftToken.ODIN]: { status: RefresherStatus.refetch },
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
            expect(refresher[NftToken.HELA]).toEqual({
                status: null
            });
        });
        const refresher = {
            [NftToken.HELA]: { status: null },
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
            expect(next[NftToken.THOR]).toEqual({
                status: RefresherStatus.refreshing
            });
            expect(next[NftToken.LOKI]).toEqual({
                status: RefresherStatus.refreshed
            });
            expect(next[NftToken.ODIN]).toEqual({
                status: RefresherStatus.refetch
            });
        });
        const refresher = {
            [NftToken.THOR]: { status: RefresherStatus.refreshing },
            [NftToken.LOKI]: { status: RefresherStatus.refreshed },
            [NftToken.ODIN]: { status: RefresherStatus.refetch },
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
            expect(next[NftToken.HELA]).toEqual({
                status: null
            });
        });
        const refresher = {
            [NftToken.HELA]: { status: null },
        };
        store.dispatch(setRatesUiRefresher({ refresher }));
    });
});
