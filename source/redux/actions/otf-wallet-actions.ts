import { OtfWallet } from '../types/otf-wallet';

export type SetOtfWallet = {
    type: 'otf-wallet/set',
    payload: Partial<OtfWallet>
};
export const setOtfWallet = (
    payload: Partial<OtfWallet>
): SetOtfWallet => ({
    type: 'otf-wallet/set', payload
});
export type SetOtfWalletAddress = {
    type: 'otf-wallet/set-address',
    payload: Pick<OtfWallet, 'address'>
};
export const setOtfWalletAddress = (
    payload: Pick<OtfWallet, 'address'>
): SetOtfWalletAddress => ({
    type: 'otf-wallet/set-address', payload
});
export type SetOtfWalletAmount = {
    type: 'otf-wallet/set-amount',
    payload: Pick<OtfWallet, 'amount'>
};
export const setOtfWalletAmount = (
    payload: Pick<OtfWallet, 'amount'>
): SetOtfWalletAmount => ({
    type: 'otf-wallet/set-amount', payload
});
export type SetOtfWalletProcessing = {
    type: 'otf-wallet/set-processing',
    payload: Pick<OtfWallet, 'processing'>
};
export const setOtfWalletProcessing = (
    payload: Pick<OtfWallet, 'processing'>
): SetOtfWalletProcessing => ({
    type: 'otf-wallet/set-processing', payload
});
export type Action =
    SetOtfWallet |
    SetOtfWalletAddress |
    SetOtfWalletAmount |
    SetOtfWalletProcessing;
