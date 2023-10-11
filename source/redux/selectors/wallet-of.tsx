import { memoize } from 'proxy-memoize';
import { AppState } from '../store';
import { Wallet } from '../types';

export const walletOf = memoize<
    AppState, Wallet
>(s => ({
    aft_wallet: s.aft_wallet,
    otf_wallet: s.otf_wallet,
}));
export default walletOf;
