import { Amount } from './base';
import { Supply } from './base';

export enum Token {
    ASIC = 'ASIC',
    GPU = 'GPU',
    CPU = 'CPU'
}
export function* Tokens() {
    for (const t in Token) {
        yield t as Token;
    }
}
export type Tokens = {
    /** token => { amount, supply } */
    items: {
        [token in Token]: {
            amount: Amount;
            supply: Supply;
        }
    },
    /** set for added token(s) */
    more?: Token[],
    /** set for removed token(s) */
    less?: Token[]
}
