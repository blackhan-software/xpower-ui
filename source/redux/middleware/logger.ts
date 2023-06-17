import * as actions from '../actions';
import { AppMiddleware } from '../store';
import { Nonce } from '../types';

type Tracker = { now: bigint; nonce: Nonce }
const trackers: Tracker[] = [];

export const Logger: AppMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    if (actions.addNonce.match(action)) {
        const { nonce, item: { amount, worker: index } } = action.payload;
        const { px, sx } = { px: nonce.slice(0, 4), sx: nonce.slice(-4) };
        const new_t = { now: BigInt(performance.now()), nonce };
        const old_t = trackers[index] ?? new_t;
        trackers[index] = new_t;
        console.log(
            `[${action.type}#${index}]`,
            `0x${px}...${sx}`, '=>', amount,
            '[', HMS(new_t, old_t).toFixed(3), 'H/ms', ']'
        );
        return next(action);
    }
    if (actions.removeNonce.match(action)) {
        const { nonce } = action.payload;
        const { px, sx } = { px: nonce.slice(0, 4), sx: nonce.slice(-4) };
        console.log(`[${action.type}]`, `0x${px}...${sx}`);
        return next(action);
    }
    if (actions.removeNonceByAmount.match(action)) {
        const { item: { amount } } = action.payload;
        console.log(`[${action.type}]`, amount);
        return next(action);
    }
    if (typeof action !== 'function') {
        console.log(`[${action.type}]`, Object.fromEntries(
            Object.entries(action).filter(([k]) => k !== 'type'))
        );
    } else {
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
        const delta = BigUint64(lhs.nonce) - BigUint64(rhs.nonce);
        return Number(1000n * delta / (lhs.now - rhs.now)) / 1000;
    }
    return 0;
}
/**
 * @returns nonce interpreted as a number
 */
function BigUint64(
    nonce: string, bytes = [] as string[]
) {
    console.assert(nonce.length % 2 === 0);
    for (let i = 2; i < nonce.length; i += 2) {
        bytes.unshift(nonce[i] + nonce[i + 1])
    }
    return BigInt('0x0' + bytes.join(''));
}
export default Logger;
