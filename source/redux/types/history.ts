import { Version } from '../../types';
import { Balance } from './base';
import { NftFullId } from './nfts';

export type History = {
    /**
     * version => token => moe|sov|nft|ppt => { balance }
     */
    items: {
        [version in Version]?: Partial<{
            moe: {
                balance: Balance;
            };
            sov: {
                balance: Balance;
            };
            nft: {
                [id in NftFullId]?: {
                    balance: Balance;
                }
            };
            ppt: {
                [id in NftFullId]?: {
                    balance: Balance;
                }
            };
        }>;
    };
    /** set of more [version] */
    more?: [Version];
    /** set of less [version] */
    less?: [Version];
}
export default History;
