import { Global, Version } from '../../types';
declare const global: Global;

import { Contract } from 'ethers';
import { Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { address } from '../address';
import { XPowerSov } from './xpower-sov';

export async function XPowerSovFactory({
    token, version
}: {
    token: Token, version?: Version
}): Promise<Contract> {
    const contract = new XPowerSov(address({
        infix: 'SOV', token: Tokenizer.xify(token), version
    }));
    return global.XPOWER_SOV = await contract.connect();
}
export default XPowerSovFactory;
