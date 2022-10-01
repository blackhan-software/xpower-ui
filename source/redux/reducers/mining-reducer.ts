import { App } from '../../app';
import { Action } from '../actions/mining-actions';
import { Mining } from '../types';

export function miningReducer(
    mining: Mining = miningState(), action: Action
): Mining {
    switch (action.type) {
        case 'mining/set-status':
            return { ...mining, status: action.payload.status };
        case 'mining/set-speed':
            return { ...mining, speed: action.payload.speed };
        case 'mining/set':
            return { ...mining, ...action.payload };
        default:
            return mining;
    }
}
export function miningState() {
    return { speed: App.speed, status: null };
}
export default miningReducer;
