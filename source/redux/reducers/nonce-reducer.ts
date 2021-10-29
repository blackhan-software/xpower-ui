/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Action } from '../actions/nonce-actions';
import { Nonce, Nonces } from '../types';

export function nonceReducer(
    nonces: Nonces = { items: {} }, action: Action
): Nonces {
    if (action.type === 'nonce/add') {
        const delta = [action.payload.nonce] as Nonce[];
        const items = {
            ...nonces.items, [action.payload.nonce]: {
                address: action.payload.item.address,
                amount: action.payload.item.amount
            }
        };
        return { items, more: delta };
    }
    if (action.type === 'nonce/remove') {
        const delta = [action.payload.nonce] as Nonce[];
        const items = Object.fromEntries(
            Object.entries(nonces.items).filter(([
                nonce, { address, amount }
            ]) => {
                if (action.payload.item.address === address &&
                    action.payload.nonce === nonce
                ) {
                    return false;
                }
                return true;
            })
        );
        return { items, less: delta };
    }
    if (action.type === 'nonce/remove-by-amount') {
        const delta = [] as Nonce[];
        const items = Object.fromEntries(
            Object.entries(nonces.items).filter(([
                nonce, { address, amount }
            ]) => {
                if (action.payload.item.address === address &&
                    action.payload.item.amount === amount
                ) {
                    delta.push(nonce);
                    return false;
                }
                return true;
            })
        );
        return { items, less: delta };
    }
    if (action.type === 'nonce/remove-all') {
        const delta = [] as Nonce[];
        const items = Object.fromEntries(
            Object.entries(nonces.items).filter(([
                nonce, { address }
            ]) => {
                if (action.payload.item.address === address ||
                    action.payload.item.address === null
                ) {
                    delta.push(nonce);
                    return false;
                }
                return true;
            })
        );
        return { items, less: delta };
    }
    return nonces;
}
export default nonceReducer;
