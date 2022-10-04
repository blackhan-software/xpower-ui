import { createAction } from '@reduxjs/toolkit';
import { OtfWallet } from '../types/otf-wallet';

export const setOtfWalletAddress
    = createAction<Pick<OtfWallet, 'address'>>('otf-wallet/set-address');
export const setOtfWalletAmount
    = createAction<Pick<OtfWallet, 'amount'>>('otf-wallet/set-amount');
export const setOtfWalletProcessing
    = createAction<Pick<OtfWallet, 'processing'>>('otf-wallet/set-processing');
export const setOtfWalletToggled
    = createAction<Pick<OtfWallet, 'toggled'>>('otf-wallet/set-toggled');
export const setOtfWallet
    = createAction<Partial<OtfWallet>>('otf-wallet/set');
