import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { State } from '../types';

export const observe = <S>(
    store: Store<State, AnyAction>
) => (
    selector: (state: State) => S, prev: S
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
