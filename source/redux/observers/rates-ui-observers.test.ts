import { AnyAction, configureStore, Store } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { ratesUiReducer } from '../reducers';

import { onRatesUi, onRatesUiRefresher } from '.';
import { setRatesUi, setRatesUiRefresher } from '../actions';
import { AppState } from '../store';
import { RefresherStatus } from '../types';

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
            expect(refresher).toEqual({
                status: RefresherStatus.refreshed
            });
        });
        const refresher = { status: RefresherStatus.refreshed };
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
            expect(refresher).toEqual({
                status: null
            });
        });
        const refresher = { status: null };
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
            expect(next).toEqual({
                status: RefresherStatus.refreshed
            });
        });
        const refresher = { status: RefresherStatus.refreshed };
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
            expect(next).toEqual({
                status: null
            });
        });
        const refresher = { status: null };
        store.dispatch(setRatesUiRefresher({ refresher }));
    });
});
