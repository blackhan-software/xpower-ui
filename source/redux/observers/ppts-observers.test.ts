import { Action, configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store } from 'redux';
import { pptsReducer } from '../reducers';

import { onPptAdded, onPptRemoved } from '.';
import { addPpt, removePpt } from '../actions';
import { AppState } from '../store';

describe('onNftAdded', () => {
    const id = '2202103';
    it('should invoke handler (for addPpt)', () => {
        const reducer = combineReducers({
            ppts: pptsReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onPptAdded(store as Store<AppState, Action>, (id, i, {
            amount: t_amount, supply: t_supply
        }) => {
            expect(id).toEqual('2202103');
            expect(i.amount).toEqual(1n);
            expect(i.supply).toEqual(2n);
            expect(t_amount).toEqual(1n);
            expect(t_supply).toEqual(2n);
        });
        store.dispatch(addPpt(id, {
            amount: 1n, supply: 2n
        }));
    });
});
describe('onNftRemoved', () => {
    const id = '2202206';
    it('should invoke handler (for removePpt)', () => {
        const reducer = combineReducers({
            ppts: pptsReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onPptRemoved(store as Store<AppState, Action>, (id, i, {
            amount: t_amount, supply: t_supply
        }) => {
            expect(id).toEqual('2202206');
            expect(i.amount).toEqual(1n);
            expect(i.supply).toEqual(2n);
            expect(t_amount).toEqual(1n);
            expect(t_supply).toEqual(2n);
        });
        store.dispatch(addPpt(id, {
            amount: 2n, supply: 3n
        }));
        store.dispatch(removePpt(id, {
            amount: 1n, kind: 'burn'
        }));
    });
});
