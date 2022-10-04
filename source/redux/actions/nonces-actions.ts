import { createAction } from '@reduxjs/toolkit';
import { Address, Amount, BlockHash, Nonce, Token } from '../types';

export const addNonce = createAction(
    'nonces/add', (nonce: Nonce, item: {
        address: Address,
        amount: Amount,
        block_hash: BlockHash,
        token: Token,
        worker: number,
    }) => ({
        payload: { nonce, item }
    })
);
export const removeNonce = createAction(
    'nonces/remove', (nonce: Nonce, item: {
        address: Address,
        block_hash: BlockHash,
        token: Token,
    }) => ({
        payload: { nonce, item }
    })
);
export const removeNonceByAmount = createAction(
    'nonces/remove-by-amount', (item: {
        address: Address,
        amount: Amount,
        block_hash: BlockHash,
        token: Token,
    }) => ({
        payload: { item }
    })
);
export const removeNonces = createAction(
    'nonces/remove-all', (item?: {
        address: Address | null,
        token: Token | null,
    }) => ({
        payload: {
            item: item ?? {
                address: null, token: null
            }
        }
    })
);
