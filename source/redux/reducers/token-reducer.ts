
import { Action } from '@reduxjs/toolkit';
import { RWParams } from '../../params';
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
    return RWParams.token;
}
export default tokenReducer;
