import { Global, Version } from '../../../source/types';
declare const global: Global;

import { Contract } from 'ethers';
import { Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { address } from '../address';
import { MoeTreasury } from './moe-treasury';

export async function MoeTreasuryFactory({
    token, version
}: {
    token: Token, version?: Version
}): Promise<Contract> {
    const contract = new MoeTreasury(address({
        infix: 'MTY', token: Tokenizer.xify(token), version
    }));
    return global.MTY = await contract.connect();
}
export default MoeTreasuryFactory;
