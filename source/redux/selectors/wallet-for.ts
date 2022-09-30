import { Token, AftWallet } from '../types';

export function walletFor(
    wallet: AftWallet, token?: Token
): AftWallet {
    const items = Object.fromEntries(
        Object.entries(wallet.items).filter(([t]) => {
            if (token !== undefined && token !== t) {
                return false;
            }
            return true;
        })
    );
    return { items };
}
