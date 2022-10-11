import { AnyAction, Middleware, ThunkAction } from '@reduxjs/toolkit';
import store, { reducer } from './store';

export type AppState = ReturnType<typeof reducer>
export type AppDispatch = typeof store.dispatch;
export type AppMiddleware = Middleware<
    Record<string, unknown>, AppState
>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType, AppState, unknown, AnyAction
>
export class Store {
    public static get store() {
        return store;
    }
}
export default Store;
