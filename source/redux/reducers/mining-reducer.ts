import { Action } from '@reduxjs/toolkit';
import { RWParams } from '../../params';
import * as actions from '../actions';
import { Mining } from '../types';

export function miningReducer(
    mining: Mining = miningState(), action: Action
): Mining {
    if (actions.setMiningStatus.match(action)) {
        return {
            ...mining, status: action.payload.status
        };
    }
    if (actions.setMiningSpeed.match(action)) {
        return {
            ...mining, speed: action.payload.speed
        };
    }
    if (actions.setMining.match(action)) {
        return $.extend(true, {}, mining, action.payload);
    }
    return mining;
}
export function miningState(
    speed?: number
) {
    return { speed: speed ?? RWParams.speed, status: null };
}
export default miningReducer;
