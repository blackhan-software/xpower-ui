import { Area, Index, Rate, Timestamp } from './base';
import { Token } from './token';

export type Rates = {
    /**
     * token => apr|bonus => { stamp, value, area }
     */
    items: {
        [token in Token]?: {
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
        };
    };
    /** set of more [token] */
    more?: [Token, Index];
    /** set of less [token] */
    less?: [Token, Index];
}
export default Rates;
