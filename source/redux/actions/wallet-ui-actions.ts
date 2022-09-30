import { DeepPartial } from 'redux';
import { WalletUi } from '../types/wallet-ui';

export type SetWalletUi = {
    type: 'wallet-ui/set', payload: DeepPartial<WalletUi>
};
export const setWalletUi = (payload: DeepPartial<WalletUi>): SetWalletUi => ({
    type: 'wallet-ui/set', payload
});
export type Action = SetWalletUi;
