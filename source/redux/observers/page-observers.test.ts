import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store } from 'redux';
import { pageReducer } from '../reducers';

import { switchPage } from '../actions';
import { AppState } from '../store';
import { Page } from '../types';
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
        onPageSwitch(store as Store<AppState, AnyAction>, (
            next, prev
        ) => {
            expect(next).toEqual(Page.About);
            expect(prev).toEqual(Page.None);
        });
        store.dispatch(switchPage(Page.About));
    });
});
