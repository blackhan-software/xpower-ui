import { Address, Amount, Nonce } from '../types';

export type AddNonce = {
    type: 'nonce/add', payload: {
        nonce: Nonce, item: { address: Address, amount: Amount }
    }
};
export const addNonce = (
    nonce: Nonce, item: { address: Address, amount: Amount }
): AddNonce => ({
    type: 'nonce/add', payload: {
        nonce, item
    }
});
export type RemoveNonce = {
    type: 'nonce/remove', payload: {
        nonce: Nonce, item: { address: Address }
    }
};
export const removeNonce = (
    nonce: Nonce, item: { address: Address }
): RemoveNonce => ({
    type: 'nonce/remove', payload: {
        nonce, item
    }
});
export type RemoveNonceByAmount = {
    type: 'nonce/remove-by-amount', payload: {
        item: { address: Address, amount: Amount }
    }
};
export const removeNonceByAmount = (
    item: { address: Address, amount: Amount }
): RemoveNonceByAmount => ({
    type: 'nonce/remove-by-amount', payload: {
        item
    }
});
export type RemoveNonces = {
    type: 'nonce/remove-all', payload: {
        item: { address: Address | null }
    }
};
export const removeNonces = (
    item: { address: Address | null }
): RemoveNonces => ({
    type: 'nonce/remove-all', payload: {
        item
    }
});
export type Action =
    AddNonce | RemoveNonce | RemoveNonceByAmount | RemoveNonces;
