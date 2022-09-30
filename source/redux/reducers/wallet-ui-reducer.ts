import { Action } from '../actions/wallet-ui-actions';
import { WalletUi } from '../types';

export function walletUiReducer(
    wallet_ui: WalletUi = { otf: otf() },
    action: Action
): WalletUi {
    if (!action.type.startsWith('wallet-ui/set')) {
        return wallet_ui;
    }
    return $.extend(true, {}, wallet_ui, action.payload);
}
export function otf() {
    return { address: null, amount: null, processing: false };
}
export default walletUiReducer;
