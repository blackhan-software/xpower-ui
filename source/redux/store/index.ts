import { Middleware } from '@reduxjs/toolkit';
import store, { reducer } from './store';

export { AppThunk } from './app-thunk';
export type AppState = ReturnType<typeof reducer>
export type AppDispatch = typeof store.dispatch;
export type AppMiddleware = Middleware<
    Record<string, unknown>, AppState
>
export function Store() {
    return store;
}
export default Store;
