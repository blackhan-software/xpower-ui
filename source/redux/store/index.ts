/* eslint @typescript-eslint/ban-types: [off] */
import { AnyAction, Middleware, ThunkAction } from '@reduxjs/toolkit';
import store, { reducer } from './store';

export type AppState = ReturnType<typeof reducer>
export type AppDispatch = typeof store.dispatch
export type AppMiddleware = Middleware<{}, AppState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType, AppState, unknown, AnyAction
>
export class Store {
    public static get dispatch() {
        return store.dispatch;
    }
    public static get store() {
        return store;
    }
    public static get state() {
        return store.getState();
    }
}
export default Store;
