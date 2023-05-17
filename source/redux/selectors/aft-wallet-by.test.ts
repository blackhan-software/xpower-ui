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
                [Token.THOR]: { amount: 0n, supply: 1n, collat: 0n },
                [Token.LOKI]: { amount: 1n, supply: 2n, collat: 0n },
                [Token.ODIN]: { amount: 2n, supply: 3n, collat: 0n },
                [Token.HELA]: { amount: 3n, supply: 4n, collat: 0n },
            },
            burner: AftWalletBurner.burned
        };
        const aft_wallet_by = aftWalletBy({ aft_wallet });
        expect(aft_wallet_by).toEqual(aft_wallet);
    });
    it('should return wallet for THOR only', () => {
        const aft_wallet = {
            items: {
                [Token.THOR]: { amount: 0n, supply: 1n, collat: 0n },
                [Token.LOKI]: { amount: 1n, supply: 2n, collat: 0n },
                [Token.ODIN]: { amount: 2n, supply: 3n, collat: 0n },
                [Token.HELA]: { amount: 3n, supply: 4n, collat: 0n },
            },
            burner: AftWalletBurner.burned
        };
        const aft_wallet_by = aftWalletBy(
            { aft_wallet }, Token.THOR
        );
        expect(aft_wallet_by.items).toEqual({
            [Token.THOR]: { amount: 0n, supply: 1n, collat: 0n },
        });
    });
    it('should return wallet for LOKI only', () => {
        const aft_wallet = {
            items: {
                [Token.LOKI]: { amount: 1n, supply: 2n, collat: 0n },
                [Token.ODIN]: { amount: 2n, supply: 3n, collat: 0n },
                [Token.HELA]: { amount: 3n, supply: 4n, collat: 0n },
            },
            burner: AftWalletBurner.burned
        };
        const aft_wallet_by = aftWalletBy(
            { aft_wallet }, Token.LOKI
        );
        expect(aft_wallet_by.items).toEqual({
            [Token.LOKI]: { amount: 1n, supply: 2n, collat: 0n },
        });
    });
    it('should return wallet for ODIN only', () => {
        const aft_wallet = {
            items: {
                [Token.ODIN]: { amount: 2n, supply: 3n, collat: 0n },
                [Token.HELA]: { amount: 3n, supply: 4n, collat: 0n },
            },
            burner: AftWalletBurner.burned
        };
        const aft_wallet_by = aftWalletBy(
            { aft_wallet }, Token.ODIN
        );
        expect(aft_wallet_by.items).toEqual({
            [Token.ODIN]: { amount: 2n, supply: 3n, collat: 0n },
        });
    });
    it('should return wallet for HELA only', () => {
        const aft_wallet = {
            items: {
                [Token.HELA]: { amount: 3n, supply: 4n, collat: 0n },
            },
            burner: AftWalletBurner.burned
        };
        const aft_wallet_by = aftWalletBy(
            { aft_wallet }, Token.HELA
        );
        expect(aft_wallet_by.items).toEqual({
            [Token.HELA]: { amount: 3n, supply: 4n, collat: 0n },
        });
    });
});
