import { AftWallet, AftWalletBurner, Empty, Token } from '../types';
import { aftWalletBy } from './aft-wallet-by';

describe('aft-wallet-by', () => {
    it('should return wallet empty', () => {
        const aft_wallet = Empty<AftWallet>();
        const aft_wallet_by = aftWalletBy({ aft_wallet });
        expect(aft_wallet_by).toEqual(aft_wallet);
    });
    it('should return wallet full[ish]', () => {
        const aft_wallet = {
            items: {
                [Token.XPOW]: { amount: 1n, supply: 2n, metric: 0n },
            },
            burner: AftWalletBurner.burned
        };
        const aft_wallet_by = aftWalletBy({ aft_wallet });
        expect(aft_wallet_by).toEqual(aft_wallet);
    });
    it('should return wallet for XPOW only', () => {
        const aft_wallet = {
            items: {
                [Token.XPOW]: { amount: 1n, supply: 2n, metric: 0n },
            },
            burner: AftWalletBurner.burned
        };
        const aft_wallet_by = aftWalletBy(
            { aft_wallet }, Token.XPOW
        );
        expect(aft_wallet_by.items).toEqual({
            [Token.XPOW]: { amount: 1n, supply: 2n, metric: 0n },
        });
    });
});
