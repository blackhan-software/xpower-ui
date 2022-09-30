import { Token, Wallet } from '../types';

export function walletFor(
    wallet: Wallet, token?: Token
): Wallet {
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
