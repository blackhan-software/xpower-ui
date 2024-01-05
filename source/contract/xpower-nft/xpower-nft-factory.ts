/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import { ROParams } from '../../params';
import { Nft, NftLevel, NftRealId } from '../../redux/types';
import { MAX_YEAR } from '../../years';
import { address } from '../address';
import { XPowerNft } from './xpower-nft';

export function XPowerNftFactory(
    { version } = { version: ROParams.version }
): XPowerNft {
    const nft = new XPowerNft(address({
        infix: 'NFT', version
    }));
    return global.XPOWER_NFT = nft;
}
export function XPowerNftMockFactory(): XPowerNft {
    const mock = {
        totalSupply: (
            /*id: string*/
        ) => {
            return 0n;
        },
        year: () => {
            return BigInt(MAX_YEAR());
        },
        uri: (
            id: bigint
        ) => {
            if (typeof id !== 'bigint') {
                id = BigInt(id);
            }
            const full_id = Nft.fullIdOf({
                real_id: id.toString() as NftRealId
            });
            return `/ipfs/QmPD85jsWPyJqfWxqCQSmMxbs9ygSLuzL3Y2xMoHrZEJMw/320x427/${full_id.slice(-6)}.json`;
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
    return <XPowerNft>{
        connect: () => Promise.resolve(mock) as any
    };
}
export default XPowerNftFactory;
