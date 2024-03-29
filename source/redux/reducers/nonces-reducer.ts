import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { Nonce, Nonces, Empty } from '../types';

export function noncesReducer(
    nonces = Empty<Nonces>(), action: Action
): Nonces {
    if (actions.addNonce.match(action)) {
        const delta = [action.payload.nonce] as Nonce[];
        const items = {
            ...nonces.items, [action.payload.nonce]: {
                ...action.payload.item
            }
        };
        return { items, more: delta };
    }
    if (actions.removeNonce.match(action)) {
        const delta = [action.payload.nonce] as Nonce[];
        const items = Object.fromEntries(
            Object.entries(nonces.items).filter(([
                nonce, { account, block_hash }
            ]) => {
                if (action.payload.item.account === account &&
                    action.payload.item.block_hash === block_hash &&
                    action.payload.nonce === nonce
                ) {
                    return false;
                }
                return true;
            })
        );
        return { items, less: delta };
    }
    if (actions.removeNonceByAmount.match(action)) {
        const delta = [] as Nonce[];
        const items = Object.fromEntries(
            Object.entries(nonces.items).filter(([
                nonce, { account, amount }
            ]) => {
                if (action.payload.item.account === account &&
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
    if (actions.removeNonces.match(action)) {
        const delta = [] as Nonce[];
        const items = Object.fromEntries(
            Object.entries(nonces.items).filter(([
                nonce, { account }
            ]) => {
                if (action.payload.item.account === account ||
                    action.payload.item.account === null
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
export default noncesReducer;
