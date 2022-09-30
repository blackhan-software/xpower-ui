import { Amount, Supply } from './base';
import { Token } from './token';

export type AftWallet = {
    /** token => { amount, supply } */
    items: {
        [token in Token]?: {
            amount: Amount;
            supply: Supply;
        };
    };
    /** set for more token(s) */
    more?: Token[];
    /** set for less token(s) */
    less?: Token[];
};
export default AftWallet;
