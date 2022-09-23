/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Action } from '../actions/minting-actions';
import { MinterRows, Minting } from '../types';
import { App } from '../../app';

export function mintingReducer(
    minting: Minting = { rows: MinterRows.init(App.level.min) },
    action: Action
): Minting {
    if (!action.type.startsWith('minting/set')) {
        return minting;
    }
    return { ...minting, ...action.payload };
}
export default mintingReducer;
