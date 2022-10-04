import { Middleware } from 'redux';
import * as actions from '../actions';

const tracker: { now: number, nonce: number }[] = [];

export const logger: Middleware = (_) => (next) => (action) => {
    if (actions.addNonce.match(action)) {
        const { nonce, item: { amount, worker: index } } = action.payload;
        const xnonce = nonce.toString(16);
        const { px, sx } = { px: xnonce.slice(0, 4), sx: xnonce.slice(-4) };
        const tms = performance.now();
        if (tracker[index || 0] === undefined ||
            tms - tracker[index || 0].now > 1000
        ) {
            tracker[index || 0] = { now: tms, nonce };
        }
        const t = tracker[index || 0];
        const hms = tms - t.now > 0 ? (nonce - t.nonce) / (tms - t.now) : 0
        console.log(`[${action.type}#${index}]`,
            `0x${px}...${sx}`, '=>', amount, '[', hms.toFixed(3), 'H/ms', ']');
        return next(action);
    }
    if (actions.removeNonce.match(action)) {
        const { nonce } = action.payload;
        const xnonce = nonce.toString(16);
        const { px, sx } = { px: xnonce.slice(0, 4), sx: xnonce.slice(-4) };
        console.log(`[${action.type}]`, `0x${px}...${sx}`);
        return next(action);
    }
    if (actions.removeNonceByAmount.match(action)) {
        const { item: { amount } } = action.payload;
        console.log(`[${action.type}]`, amount);
        return next(action);
    }
    console.log(`[${action.type}]`, action.payload);
    return next(action);
};
export default logger;
