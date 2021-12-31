/* eslint @typescript-eslint/no-unused-vars: [off] */
import { AddNonce, RemoveNonce, RemoveNonceByAmount } from '../actions';
import { Middleware } from 'redux';

export const logger: Middleware = (store_api) => (next) => (action) => {
    if (action.type === 'nonce/add') {
        const add = action as AddNonce;
        const { nonce, item: { amount } } = add.payload;
        const xnonce = nonce.toString(16);
        const { px, sx } = { px: xnonce.slice(0, 4), sx: xnonce.slice(-4) };
        console.log(`[${add.type}]`, `0x${px}...${sx}`, '=>', amount);
    } else if (action.type === 'nonce/remove') {
        const remove = action as RemoveNonce;
        const { nonce } = remove.payload;
        const xnonce = nonce.toString(16);
        const { px, sx } = { px: xnonce.slice(0, 4), sx: xnonce.slice(-4) };
        console.log(`[${remove.type}]`, `0x${px}...${sx}`);
    } else if (action.type === 'nonce/remove-by-amount') {
        const remove_by_amount = action as RemoveNonceByAmount;
        const { item: { amount } } = remove_by_amount.payload;
        console.log(`[${remove_by_amount.type}]`, amount);
    } else {
        console.log(`[${action.type}]`, action.payload);
    }
    return next(action);
};
export default logger;
