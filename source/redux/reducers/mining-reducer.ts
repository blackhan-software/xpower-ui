/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Action } from '../actions/mining-actions';
import { Mining } from '../types';
import { App } from '../../app';

export function miningReducer(
    mining: Mining = { speed: App.speed, status: null }, action: Action
): Mining {
    if (!action.type.startsWith('mining/set')) {
        return mining;
    }
    return { ...mining, ...action.payload };
}
export default miningReducer;
