/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global, Version } from '../../../source/types';
declare const global: Global;

import { BigNumber } from 'ethers';
import { ROParams } from '../../params';
import { Nft, NftLevel, NftRealId, Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { MAX_YEAR } from '../../years';
import { address } from '../address';
import { XPowerNft } from './xpower-nft';

export function XPowerNftFactory({
    token, version
}: {
    token: Token, version?: Version
}): XPowerNft {
    if (version === undefined) {
        version = ROParams.version;
    }
    const xtoken = version < Version.v6a
        ? Tokenizer.xify(token) : 'XPOW';
    const nft = new XPowerNft(address({
        infix: 'NFT', token: xtoken, version
    }));
    return global.XPOWER_NFT = nft;
}
export function XPowerNftMockFactory(
    { token }: { token: Token }
): XPowerNft {
    const nft_token = Nft.token(token);
    const mock = {
        totalSupply: (
            /*id: string*/
        ) => {
            return BigNumber.from(0);
        },
        year: () => {
            return BigNumber.from(MAX_YEAR());
        },
        uri: (
            id: BigNumber
        ) => {
            if (!BigNumber.isBigNumber(id)) {
                id = BigNumber.from(id);
            }
            const full_id = Nft.fullIdOf({
                real_id: id.toString() as NftRealId,
                token: Nft.token(token)
            });
            return `/ipfs/QmcmK4qk2vCCzVTnggzZeJes3Leontx3ZH1tNNQ2QZK3F3/320x427/${full_id}.json`;
        },
        idBy: (
            year: BigNumber,
            level: NftLevel,
            index?: BigNumber
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
    return <XPowerNft>{
        connect: () => Promise.resolve(mock) as any
    };
}
export default XPowerNftFactory;
