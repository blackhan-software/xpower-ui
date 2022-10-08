import { Action } from '@reduxjs/toolkit';
import { Params } from '../../params';
import * as actions from '../actions';
import { Mining, Tokens } from '../types';

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
            ...mining, speed: {
                ...mining.speed, ...action.payload.speed
            }
        };
    }
    if (actions.setMining.match(action)) {
        return $.extend(true, {}, mining, action.payload);
    }
    return mining;
}
export function miningState() {
    const speed = {} as Mining['speed'];
    for (const token of Tokens()) {
        speed[token] = Params.speed;
    }
    return { speed, status: null };
}
export default miningReducer;
