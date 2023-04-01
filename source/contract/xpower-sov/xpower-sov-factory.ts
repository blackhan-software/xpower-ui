import { Global, Version } from '../../types';
declare const global: Global;

import { Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { address } from '../address';
import { XPowerSov } from './xpower-sov';

export function XPowerSovFactory({
    token, version
}: {
    token: Token, version?: Version
}): XPowerSov {
    const sov = new XPowerSov(address({
        infix: 'SOV', token: Tokenizer.xify(token), version
    }));
    return global.XPOWER_SOV = sov;
}
export default XPowerSovFactory;
