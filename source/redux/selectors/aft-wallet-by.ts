import { AppState } from '../store';
import { AftWallet, Token } from '../types';

export function aftWalletBy(
    { aft_wallet }: Pick<AppState, 'aft_wallet'>, token?: Token
): AftWallet {
    const items = Object.fromEntries(
        Object.entries(aft_wallet.items).filter(([t]) => {
            if (token !== undefined && token !== t) {
                return false;
            }
            return true;
        })
    );
    return { ...aft_wallet, items };
}
export default aftWalletBy;
