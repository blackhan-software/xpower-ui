import { Global, Version } from '../../../source/types';
declare const global: Global;

import { ROParams } from '../../params';
import { Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { address } from '../address';
import { MoeTreasury } from './moe-treasury';

export function MoeTreasuryFactory({
    token, version
}: {
    token: Token, version?: Version
}): MoeTreasury {
    if (version === undefined) {
        version = ROParams.version;
    }
    const xtoken = version < Version.v6b
        ? Tokenizer.xify(token) : 'XPOW';
    const mty = new MoeTreasury(address({
        infix: 'MTY', token: xtoken, version
    }));
    return global.MTY = mty;
}
export default MoeTreasuryFactory;
