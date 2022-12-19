/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global, Version } from '../../../source/types';
declare const global: Global;

import { BigNumber, Contract } from 'ethers';
import { ROParams } from '../../params';
import { Nft, NftLevel, NftRealId, Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { MAX_YEAR } from '../../years';
import { address } from '../address';
import { XPowerPpt } from './xpower-ppt';

export async function XPowerPptFactory({
    token, version
}: {
    token: Token, version?: Version
}): Promise<Contract> {
    if (version === undefined) {
        version = ROParams.version;
    }
    const xtoken = version < Version.v6a
        ? Tokenizer.xify(token) : 'XPOW';
    const contract = new XPowerPpt(address({
        infix: 'PPT', token: xtoken, version
    }));
    return global.XPOWER_PPT = await contract.connect();
}
export async function XPowerPptMockFactory(
    { token }: { token: Token }
): Promise<Contract> {
    const nft_token = Nft.token(token);
    const mock = {
        totalSupply: (/*id:string*/) => {
            return BigNumber.from(0);
        },
        year: () => {
            return BigNumber.from(MAX_YEAR());
        },
        uri: (id: BigNumber) => {
            if (!BigNumber.isBigNumber(id)) {
                id = BigNumber.from(id);
            }
            const full_id = Nft.fullIdOf({
                real_id: id.toString() as NftRealId,
                token: Nft.token(token)
            });
            return `/ipfs/QmP1HdbVWnuUJzKZZVp4gNYa9bKpBVQCmzDPEinhz2MBo2/ppts/320x427/${full_id}.json`;
        },
        idBy: (
            year: BigNumber, level: NftLevel, index?: BigNumber
        ) => {
            if (!BigNumber.isBigNumber(year)) {
                year = BigNumber.from(year);
            }
            if (!BigNumber.isBigNumber(index)) {
                index = BigNumber.from(index ?? Nft.oldIndexOf(nft_token));
            }
            return index.add(1).mul(1_000_000).add(
                year.mul(100).add(level)
            );
        },
    };
    return mock as any;
}
export default XPowerPptFactory;
