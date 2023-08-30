import { Global } from '../../types';
declare const global: Global;

import { ROParams } from '../../params';
import { address } from '../address';
import { XPowerMoe } from './xpower-moe';

export function XPowerMoeFactory(
    { version } = { version: ROParams.version }
): XPowerMoe {
    const moe = new XPowerMoe(address({
        infix: 'MOE', version
    }));
    return global.XPOWER_MOE = moe;
}
export default XPowerMoeFactory;
