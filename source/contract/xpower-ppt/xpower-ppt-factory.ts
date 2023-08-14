/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global, Version } from '../../../source/types';
declare const global: Global;

import { ROParams } from '../../params';
import { Nft, NftLevel, NftRealId, Token } from '../../redux/types';
import { Tokenizer } from '../../token';
import { MAX_YEAR } from '../../years';
import { address } from '../address';
import { XPowerPpt } from './xpower-ppt';

export function XPowerPptFactory({
    token, version
}: {
    token: Token, version?: Version
}): XPowerPpt {
    if (version === undefined) {
        version = ROParams.version;
    }
    const ppt = new XPowerPpt(address({
        infix: 'PPT', token: Tokenizer.xify(token), version
    }));
    return global.XPOWER_PPT = ppt;
}
export function XPowerPptMockFactory(
    { token }: { token: Token }
): XPowerPpt {
    const nft_token = Nft.token(token);
    const mock = {
        totalSupply: (
            /*id: string*/
        ) => {
            return 0n;
        },
        year: () => {
            return BigInt(MAX_YEAR());
        },
        uri: (id: bigint) => {
            if (typeof id !== 'bigint') {
                id = BigInt(id);
            }
            const full_id = Nft.fullIdOf({
                real_id: id.toString() as NftRealId
            });
            return `/ipfs/QmYfHKkkm26y8Xd7Aur8uvaXmca82s3Nrve74RY8BrhckS/320x427/${full_id}.json`;
        },
        idBy: (
            year: bigint,
            level: NftLevel,
            index?: bigint
        ) => {
            if (typeof year !== 'bigint') {
                year = BigInt(year);
            }
            if (typeof index !== 'bigint') {
                index = BigInt(index ?? Nft.oldIndexOf(nft_token));
            }
            return 1_000_000n * (index + 1n) + 100n * year + BigInt(level);
        },
    };
    return <XPowerPpt>{
        connect: () => Promise.resolve(mock) as any
    };
}
export default XPowerPptFactory;
