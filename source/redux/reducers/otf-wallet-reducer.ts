import { Action } from '../actions/otf-wallet-actions';
import { OtfWallet } from '../types';

export function otfWalletReducer(
    otf_wallet: OtfWallet = otfWalletState(), action: Action
): OtfWallet {
    switch (action.type) {
        case 'otf-wallet/set-processing':
            return { ...otf_wallet, processing: action.payload.processing };
        case 'otf-wallet/set-address':
            return { ...otf_wallet, address: action.payload.address };
        case 'otf-wallet/set-amount':
            return { ...otf_wallet, amount: action.payload.amount };
        case 'otf-wallet/set':
            return $.extend(true, {}, otf_wallet, action.payload);
        default:
            return otf_wallet;
    }
}
export function otfWalletState() {
    return { address: null, amount: null, processing: false };
}
export default otfWalletReducer;
