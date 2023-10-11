import { AppState } from '../store';
import { AftWalletBurner, Token } from '../types';
import { walletOf } from './wallet-of';

describe('wallet-of', () => {
    it('should return wallet', () => {
        const aft_wallet = {
            items: {
                [Token.XPOW]: { amount: 1n, supply: 2n, metric: 0n },
            },
            burner: AftWalletBurner.burned
        };
        const otf_wallet = {
            account: null, amount: null,
            processing: null, toggled: null
        };
        const wallet = {
            aft_wallet, otf_wallet
        };
        const wallet_of = walletOf(wallet as AppState);
        expect(wallet_of).toEqual(wallet);
    });
});
