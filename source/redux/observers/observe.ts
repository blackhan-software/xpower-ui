import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { AppState } from '../store';

export const observe = <S>(
    store: Store<AppState, AnyAction>
) => (
    selector: (state: AppState) => S, prev: S
) => (
    callback: (next: S, prev: S) => void
): Unsubscribe => {
    return store.subscribe(() => {
        const next = selector(store.getState());
        if (next !== prev) {
            callback(next, prev);
            prev = next;
        }
    });
}
export default observe;
