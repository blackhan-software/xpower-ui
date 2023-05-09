import { AnyAction, configureStore, Store } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { nftsUiReducer } from '../reducers';

import { onNftsUiFlags } from '.';
import { setNftsUiFlags } from '../actions';
import { AppState } from '../store';
import { NftLevel } from '../types';

describe('onNftsUiFlags', () => {
    it('should invoke handler (for setNftsUiFlags)', () => {
        const reducer = combineReducers({
            nfts_ui: nftsUiReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onNftsUiFlags(store as Store<AppState, AnyAction>, (flags) => {
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
        store.dispatch(setNftsUiFlags({ flags }));
    });
});
