import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store } from 'redux';
import { tokenReducer } from '../reducers';

import { switchToken } from '../actions';
import { AppState } from '../store';
import { Token } from '../types';
import { onTokenSwitch } from './token-observers';

describe('onTokenSwitch', () => {
    it('should invoke handler (for switchToken)', () => {
        const reducer = combineReducers({
            token: tokenReducer
        });
        const store = configureStore({
            reducer, middleware: (m) => m({
                serializableCheck: false
            })
        });
        onTokenSwitch(store as Store<AppState, AnyAction>, (
            next, prev
        ) => {
            expect(next).toEqual(Token.XPOW);
            expect(prev).toEqual(Token.XPOW);
        });
        store.dispatch(switchToken(Token.XPOW));
    });
});
