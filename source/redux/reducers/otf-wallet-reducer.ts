import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { OtfWallet } from '../types';

export function otfWalletReducer(
    otf_wallet: OtfWallet = otfWalletState(), action: Action
): OtfWallet {
    if (actions.setOtfWalletAddress.match(action)) {
        return { ...otf_wallet, address: action.payload.address };
    }
    if (actions.setOtfWalletAmount.match(action)) {
        return { ...otf_wallet, amount: action.payload.amount };
    }
    if (actions.setOtfWalletProcessing.match(action)) {
        return { ...otf_wallet, processing: action.payload.processing };
    }
    if (actions.setOtfWalletToggle.match(action)) {
        return { ...otf_wallet, toggled: action.payload.toggled };
    }
    if (actions.setOtfWallet.match(action)) {
        return $.extend(true, {}, otf_wallet, action.payload);
    }
    return otf_wallet;
}
export function otfWalletState() {
    return {
        address: null, amount: null,
        processing: null, toggled: null
    };
}
export default otfWalletReducer;
