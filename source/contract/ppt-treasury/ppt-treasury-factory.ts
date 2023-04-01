import { Global, Version } from '../../../source/types';
declare const global: Global;

import { ROParams } from '../../params';
import { Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { address } from '../address';
import { PptTreasury } from './ppt-treasury';

export function PptTreasuryFactory({
    token, version
}: {
    token: Token, version?: Version
}): PptTreasury {
    if (version === undefined) {
        version = ROParams.version;
    }
    const xtoken = version < Version.v6a
        ? Tokenizer.xify(token) : 'XPOW';
    const pty = new PptTreasury(address({
        infix: 'PTY', token: xtoken, version
    }));
    return global.PTY = pty;
}
export default PptTreasuryFactory;
