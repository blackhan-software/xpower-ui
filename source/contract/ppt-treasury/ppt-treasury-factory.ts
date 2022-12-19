import { Global, Version } from '../../../source/types';
declare const global: Global;

import { Contract } from 'ethers';
import { ROParams } from '../../params';
import { Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { address } from '../address';
import { PptTreasury } from './ppt-treasury';

export async function PptTreasuryFactory({
    token, version
}: {
    token: Token, version?: Version
}): Promise<Contract> {
    if (version === undefined) {
        version = ROParams.version;
    }
    const xtoken = version < Version.v6a
        ? Tokenizer.xify(token) : 'XPOW';
    const contract = new PptTreasury(address({
        infix: 'PTY', token: xtoken, version
    }));
    return global.PTY = await contract.connect();
}
export default PptTreasuryFactory;
