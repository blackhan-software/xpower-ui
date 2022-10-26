import { Amount, Supply } from './base';
import { Token } from './token';

export type AftWallet = {
    /** token => { amount, supply, decimals } */
    items: {
        [token in Token]?: {
            amount: Amount;
            supply: Supply;
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
