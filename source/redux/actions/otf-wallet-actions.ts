import { OtfWallet } from '../types/otf-wallet';

export type SetOtfWallet = {
    type: 'otf-wallet/set', payload: Partial<OtfWallet>
};
export const setOtfWallet = (payload: Partial<OtfWallet>): SetOtfWallet => ({
    type: 'otf-wallet/set', payload
});
export type Action = SetOtfWallet;
