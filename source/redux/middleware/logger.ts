/* eslint @typescript-eslint/no-unused-vars: [off] */
import { AddNonce, RemoveNonce, RemoveNonceByAmount } from '../actions';
import { Middleware } from 'redux';

export const logger: Middleware = (store_api) => (next) => (action) => {
    if (action.type === 'nonce/add') {
        const add = action as AddNonce;
        const { nonce, item: { address, amount } } = add.payload;
        const { px, sx } = { px: nonce.slice(2, 6), sx: nonce.slice(-4) };
        console.log(`[${add.type}]`, `0x${px}...${sx}`, '=>', amount);
    } else if (action.type === 'nonce/remove') {
        const remove = action as RemoveNonce;
        const { nonce } = remove.payload;
        const { px, sx } = { px: nonce.slice(2, 6), sx: nonce.slice(-4) };
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
