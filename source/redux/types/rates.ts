import { Area, Index, Rate, Timestamp } from './base';
import { NftLevel } from './nfts';

export type Rates = {
    /**
     * token => nft-level => apr|bonus => { stamp, value, area }
     */
    items: {
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
    /** set of more [index] */
    more?: [Index | null];
    /** set of less [index] */
    less?: [Index | null];
}
export default Rates;
