import { Action } from '../actions/otf-wallet-actions';
import { OtfWallet } from '../types';

export function otfWalletReducer(
    otf_wallet: OtfWallet = otfWalletState(), action: Action
): OtfWallet {
    if (!action.type.startsWith('otf-wallet/set')) {
        return otf_wallet;
    }
    return $.extend(true, {}, otf_wallet, action.payload);
}
export function otfWalletState() {
    return { address: null, amount: null, processing: false };
}
export default otfWalletReducer;
