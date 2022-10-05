import { Action, configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store } from 'redux';
import { pageReducer } from '../reducers';

import { switchPage } from '../actions';
import { Page, State } from '../types';
import { onPageSwitch } from './page-observers';

describe('onPageSwitch', () => {
    it('should invoke handler (for switchPage)', () => {
        const reducer = combineReducers({
            page: pageReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onPageSwitch(store as Store<State, Action>, (
            next, prev
        ) => {
            expect(next).toEqual(Page.About);
            expect(prev).toEqual(Page.None);
        });
        store.dispatch(switchPage(Page.About));
    });
});
