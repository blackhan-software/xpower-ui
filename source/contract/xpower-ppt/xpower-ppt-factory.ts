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
        prefix: 'APOW', infix: 'NFT', version
    }));
    return global.XPOWER_PPT = ppt;
}
export function XPowerPptMockFactory(): XPowerPpt {
    const mock = {
        'totalSupply(uint256)': (
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
            /** @dev update each year; otherwise, ppt-wallet.tests fail! */
            return `/ipfs/QmaYKujtmA5XAS87oeYcHbUA84LeyGi5xYv6ErnXe1bRLF/320x427/${full_id.slice(-6)}.json`;
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
