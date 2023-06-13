import { Area, Index, Rate, Timestamp } from './base';
import { NftLevel } from './nfts';
import { Token } from './token';

export type Rates = {
    /**
     * token => nft-level => apr|bonus => { stamp, value, area }
     */
    items: {
        [token in Token]?: {
            [level in NftLevel]?: {
                apr: {
                    [index: Index]: {
                        stamp: Timestamp,
                        value: Rate,
                        area: Area
                    }
                };
                bonus: {
                    [index: Index]: {
                        stamp: Timestamp,
                        value: Rate,
                        area: Area
                    }
                };
            }
        };
    };
    /** set of more [token, index] */
    more?: [Token, Index | null];
    /** set of less [token, index] */
    less?: [Token, Index | null];
}
export default Rates;
