/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Action } from '../actions/refresh-actions';
import { Refresh } from '../types';

export function refreshReducer(
    refresh: Refresh = { date: null }, action: Action
): Refresh {
    if (action.type === 'refresh') {
        return { date: action.payload.date };
    }
    return refresh;
}
export default refreshReducer;
