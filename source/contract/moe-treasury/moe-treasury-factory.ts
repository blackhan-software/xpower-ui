import { Global, Version } from '../../../source/types';
declare const global: Global;

import { Contract } from 'ethers';
import { Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { address } from '../address';
import { MoeTreasury } from './moe-treasury';
import { ROParams } from '../../params';

export async function MoeTreasuryFactory({
    token, version
}: {
    token: Token, version?: Version
}): Promise<Contract> {
    if (version === undefined) {
        version = ROParams.version;
    }
    const xtoken = version < Version.v6b
        ? Tokenizer.xify(token) : 'XPOW';
    const contract = new MoeTreasury(address({
        infix: 'MTY', token: xtoken, version
    }));
    return global.MTY = await contract.connect();
}
export default MoeTreasuryFactory;
