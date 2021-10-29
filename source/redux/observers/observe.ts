import { Store, Unsubscribe } from 'redux';
import { Action } from '../actions'
import { State } from '../types';

export const observe = <S>(
    store: Store<State, Action>
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
