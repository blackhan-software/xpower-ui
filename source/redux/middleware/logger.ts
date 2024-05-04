import { isAction } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { AppMiddleware } from '../store';
import { Nonce } from '../types';

type Tracker = { now: bigint; nonce: Nonce }
const trackers: Tracker[] = [];

export const Logger: AppMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    if (actions.addNonce.match(action)) {
        const { nonce, item: { amount, worker: index } } = action.payload;
        const new_t = { now: BigInt(performance.now()), nonce };
        const old_t = trackers[index] ?? new_t;
        trackers[index] = new_t;
        console.log(
            `[${action.type}#${index}]`, nonce, '=>', amount,
            '[', HMS(new_t, old_t).toFixed(3), 'H/ms', ']'
        );
        return next(action);
    }
    if (actions.removeNonce.match(action)) {
        const { nonce } = action.payload;
        console.log(`[${action.type}]`, nonce);
        return next(action);
    }
    if (actions.removeNonceByAmount.match(action)) {
        const { item: { amount } } = action.payload;
        console.log(`[${action.type}]`, amount);
        return next(action);
    }
    if (isAction(action)) {
        console.log(`[${action.type}]`, Object.fromEntries(
            Object.entries(action).filter(([k]) => k !== 'type'))
        );
    } else if (typeof action === 'function') {
        return action(dispatch, getState);
    }
    return next(action);
};
/**
 * @returns hashes per millisecond
 */
function HMS(
    lhs: Tracker, rhs: Tracker
) {
    if (lhs.now - rhs.now > 0) {
        const delta = BigInt(lhs.nonce) - BigInt(rhs.nonce);
        return Number(1000n * delta / (lhs.now - rhs.now)) / 1000;
    }
    return 0;
}
export default Logger;
