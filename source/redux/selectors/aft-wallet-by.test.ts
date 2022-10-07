import { AftWallet, Empty, Token } from '../types';
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
                [Token.THOR]: { amount: 0n, supply: 1n },
                [Token.LOKI]: { amount: 1n, supply: 2n },
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const aft_wallet_by = aftWalletBy({ aft_wallet });
        expect(aft_wallet_by).toEqual(aft_wallet);
    });
    it('should return wallet for THOR only', () => {
        const aft_wallet = {
            items: {
                [Token.THOR]: { amount: 0n, supply: 1n },
                [Token.LOKI]: { amount: 1n, supply: 2n },
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const aft_wallet_by = aftWalletBy(
            { aft_wallet }, Token.THOR
        );
        expect(aft_wallet_by).toEqual({
            items: {
                [Token.THOR]: { amount: 0n, supply: 1n },
            }
        });
    });
    it('should return wallet for LOKI only', () => {
        const aft_wallet = {
            items: {
                [Token.LOKI]: { amount: 1n, supply: 2n },
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const aft_wallet_by = aftWalletBy(
            { aft_wallet }, Token.LOKI
        );
        expect(aft_wallet_by).toEqual({
            items: {
                [Token.LOKI]: { amount: 1n, supply: 2n },
            }
        });
    });
    it('should return wallet for ODIN only', () => {
        const aft_wallet = {
            items: {
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const aft_wallet_by = aftWalletBy(
            { aft_wallet }, Token.ODIN
        );
        expect(aft_wallet_by).toEqual({
            items: {
                [Token.ODIN]: { amount: 2n, supply: 3n },
            }
        });
    });
    it('should return wallet for HELA only', () => {
        const aft_wallet = {
            items: {
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const aft_wallet_by = aftWalletBy(
            { aft_wallet }, Token.HELA
        );
        expect(aft_wallet_by).toEqual({
            items: {
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        });
    });
});
