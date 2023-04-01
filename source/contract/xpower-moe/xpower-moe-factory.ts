import { Global, Version } from '../../types';
declare const global: Global;

import { Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { address } from '../address';
import { XPowerMoe } from './xpower-moe';

export function XPowerMoeFactory({
    token, version
}: {
    token: Token, version?: Version
}): XPowerMoe {
    const moe = new XPowerMoe(address({
        infix: 'MOE', token: Tokenizer.xify(token), version
    }));
    return global.XPOWER_MOE = moe;
}
export default XPowerMoeFactory;
