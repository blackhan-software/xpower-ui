import { Global } from '../../types';
declare const global: Global;

import { ROParams } from '../../params';
import { address } from '../address';
import { XPowerSov } from './xpower-sov';

export function XPowerSovFactory(
    { version } = { version: ROParams.version }
): XPowerSov {
    const sov = new XPowerSov(address({
        infix: 'SOV', version
    }));
    return global.XPOWER_SOV = sov;
}
export default XPowerSovFactory;
