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
    const pty_address = address({
        infix: 'PTY', token: Tokenizer.xify(token), version
    });
    return global.PTY = new PptTreasury(pty_address, version);
}
export default PptTreasuryFactory;
