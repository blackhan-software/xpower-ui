import { Middleware, UnknownAction } from '@reduxjs/toolkit';
import store, { reducer } from './store';

export { AppThunk } from './app-thunk';
export type AppState = ReturnType<typeof reducer>
export type AppDispatch = typeof store.dispatch;
export type AppMiddleware = Middleware<
    Record<string, UnknownAction>, AppState
>
export function Store() {
    return store;
}
export default Store;
