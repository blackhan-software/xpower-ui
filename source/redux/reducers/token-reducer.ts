import { App } from '../../app';

import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { Token } from '../types';

export function tokenReducer(
    token: Token = tokenState(), action: Action
): Token {
    if (actions.switchToken.match(action)) {
        return action.payload.token;
    }
    return token;
}
export function tokenState() {
    return App.token;
}
export default tokenReducer;
