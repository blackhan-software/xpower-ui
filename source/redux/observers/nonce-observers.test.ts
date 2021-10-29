import { combineReducers, createStore } from 'redux';

import { addNonce, removeNonce, removeNonceByAmount } from '../actions';
import { refreshReducer, nonceReducer } from '../reducers';
import { onNonceAdded, onNonceRemoved } from '.';

describe('onNonceAdded', () => {
    const address = '0xabcd';
    it('should invoke handler (for addNonce)', () => {
        const reducer = combineReducers({
            refresh: refreshReducer,
            nonces: nonceReducer
        });
        const store = createStore(reducer);
        onNonceAdded(store, (n, i, t_by, t) => {
            expect(n).toEqual('0xffff');
            expect(i.address).toEqual(address);
            expect(i.amount).toEqual(1);
            expect(t_by).toEqual(1);
            expect(t).toEqual(1);
        });
        store.dispatch(addNonce('0xffff', { address, amount: 1 }));
    });
});
describe('onNonceRemoved', () => {
    const address = '0xabcd';
    it('should invoke handler (for removeNonce)', () => {
        const reducer = combineReducers({
            refresh: refreshReducer,
            nonces: nonceReducer
        });
        const store = createStore(reducer);
        onNonceRemoved(store, (n, i, t_by, t) => {
            expect(n).toEqual('0xffff');
            expect(i.address).toEqual(address);
            expect(i.amount).toEqual(1);
            expect(t_by).toEqual(0);
            expect(t).toEqual(0);
        });
        store.dispatch(addNonce('0xffff', { address, amount: 1 }));
        store.dispatch(removeNonce('0xffff', { address }));
    });
    it('should invoke handler (for removeNonceByAmount)', () => {
        const reducer = combineReducers({
            refresh: refreshReducer,
            nonces: nonceReducer
        });
        const store = createStore(reducer);
        onNonceRemoved(store, (n, i, t_by, t) => {
            expect(n).toEqual('0xffff');
            expect(i.address).toEqual(address);
            expect(i.amount).toEqual(1);
            expect(t_by).toEqual(0);
            expect(t).toEqual(0);
        });
        store.dispatch(addNonce('0xffff', { address, amount: 1 }));
        store.dispatch(removeNonceByAmount({ address, amount: 1 }));
    });
});
