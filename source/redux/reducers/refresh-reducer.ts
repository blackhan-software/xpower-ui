import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { Refresh } from '../types';

export function refreshReducer(
    refresh: Refresh = refreshState(), action: Action
): Refresh {
    if (actions.refresh.match(action)) {
        return { date: action.payload.date };
    }
    return refresh;
}
export function refreshState() {
    return { date: null };
}
export default refreshReducer;
