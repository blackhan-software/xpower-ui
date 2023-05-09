import { AnyAction, configureStore, Store } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { pptsUiReducer } from '../reducers';

import { onPptsUiFlags } from '.';
import { setPptsUiFlags } from '../actions';
import { AppState } from '../store';
import { NftLevel } from '../types';

describe('onPptsUiFlags', () => {
    it('should invoke handler (for setPptsUiFlags)', () => {
        const reducer = combineReducers({
            ppts_ui: pptsUiReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onPptsUiFlags(store as Store<AppState, AnyAction>, (flags) => {
            expect(flags[NftLevel.UNIT]).toEqual({
                display: true, toggled: true
            });
            expect(flags[NftLevel.KILO]).toEqual({
                display: false, toggled: false
            });
        });
        const flags = {
            [NftLevel.UNIT]: { toggled: true },
            [NftLevel.KILO]: { display: false },
        };
        store.dispatch(setPptsUiFlags({ flags }));
    });
});
