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
    const mty_address = address({
        infix: 'MTY', token: Tokenizer.xify(token), version
    });
    return global.MTY = new MoeTreasury(mty_address, version);
}
export default MoeTreasuryFactory;
