import { Version } from '../../types';
import { Balance } from './base';
import { NftFullId } from './nfts';
import { Token } from './token';

export type History = {
    /**
     * version => token => moe|sov|nft|ppt => { balance }
     */
    items: {
        [version in Version]?: {
            [token in Token]?: Partial<{
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
    };
    /** set of more [version, token] */
    more?: [Version, Token];
    /** set of less [version, token] */
    less?: [Version, Token];
}
export default History;
