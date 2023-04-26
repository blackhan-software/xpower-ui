import { createAction } from '@reduxjs/toolkit';
import { OtfWallet } from '../types/otf-wallet';

export const setOtfWalletAccount
    = createAction<Pick<OtfWallet, 'account'>>('otf-wallet/set-account');
export const setOtfWalletAmount
    = createAction<Pick<OtfWallet, 'amount'>>('otf-wallet/set-amount');
export const setOtfWalletProcessing
    = createAction<Pick<OtfWallet, 'processing'>>('otf-wallet/set-processing');
export const setOtfWalletToggle
    = createAction<Pick<OtfWallet, 'toggled'>>('otf-wallet/set-toggle');
export const setOtfWallet
    = createAction<Partial<OtfWallet>>('otf-wallet/set');
