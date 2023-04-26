import { createAction } from '@reduxjs/toolkit';
import { Account, Amount, BlockHash, Nonce, Token } from '../types';

export const addNonce = createAction(
    'nonces/add', (nonce: Nonce, item: {
        account: Account,
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
        account: Account,
        block_hash: BlockHash,
        token: Token,
    }) => ({
        payload: { nonce, item }
    })
);
export const removeNonceByAmount = createAction(
    'nonces/remove-by-amount', (item: {
        account: Account,
        amount: Amount,
        block_hash: BlockHash,
        token: Token,
    }) => ({
        payload: { item }
    })
);
export const removeNonces = createAction(
    'nonces/remove-all', (item?: {
        account: Account | null,
        token: Token | null,
    }) => ({
        payload: {
            item: item ?? {
                account: null, token: null
            }
        }
    })
);
