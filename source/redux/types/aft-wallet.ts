import { Amount, Metric, Supply } from './base';
import { Token } from './token';

export type AftWallet = {
    /** token => { amount, supply } */
    items: {
        [token in Token]?: {
            amount: Amount;
            supply: Supply;
            metric: Metric;
        };
    };
    /** set of more token(s) */
    more?: Token[];
    /** set of less token(s) */
    less?: Token[];
} & {
    burner: AftWalletBurner | null;
}
export enum AftWalletBurner {
    burning = 'burning',
    burned = 'burned',
    error = 'error'
}
export default AftWallet;
