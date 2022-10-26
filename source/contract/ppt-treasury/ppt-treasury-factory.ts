import { Global, Version } from '../../../source/types';
declare const global: Global;

import { Contract } from 'ethers';
import { Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { address } from '../address';
import { PptTreasury } from './ppt-treasury';

export async function PptTreasuryFactory({
    token, version
}: {
    token: Token, version?: Version
}): Promise<Contract> {
    const contract = new PptTreasury(address({
        infix: 'PPT_TREASURY', token: Tokenizer.xify(token), version
    }));
    return global.PPT_TREASURY = await contract.connect();
}
export default PptTreasuryFactory;
