/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import { ROParams } from '../../params';
import { Nft, NftLevel, NftRealId } from '../../redux/types';
import { MAX_YEAR } from '../../years';
import { address } from '../address';
import { XPowerPpt } from './xpower-ppt';

export function XPowerPptFactory(
    { version } = { version: ROParams.version }
): XPowerPpt {
    const ppt = new XPowerPpt(address({
        infix: 'PPT', version
    }));
    return global.XPOWER_PPT = ppt;
}
export function XPowerPptMockFactory(): XPowerPpt {
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
                index = BigInt(index ?? 1);
            }
            return 1_000_000n * (index + 1n) + 100n * year + BigInt(level);
        },
    };
    return <XPowerPpt>{
        connect: () => Promise.resolve(mock) as any
    };
}
export default XPowerPptFactory;
