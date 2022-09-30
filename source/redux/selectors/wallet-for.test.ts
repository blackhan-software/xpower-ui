import { Empty, Token, AftWallet } from '../types';
import { walletFor } from './wallet-for';

describe('wallet-for', () => {
    it('should return wallet empty', () => {
        const wallet = Empty<AftWallet>();
        const wallet_by = walletFor(wallet);
        expect(wallet_by).toEqual(wallet);
    });
    it('should return wallet full[ish]', () => {
        const wallet = {
            items: {
                [Token.THOR]: { amount: 0n, supply: 1n },
                [Token.LOKI]: { amount: 1n, supply: 2n },
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const wallet_by = walletFor(wallet);
        expect(wallet_by).toEqual(wallet);
    });
    it('should return wallet for THOR only', () => {
        const wallet = {
            items: {
                [Token.THOR]: { amount: 0n, supply: 1n },
                [Token.LOKI]: { amount: 1n, supply: 2n },
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const wallet_by = walletFor(wallet, Token.THOR);
        expect(wallet_by).toEqual({
            items: {
                [Token.THOR]: { amount: 0n, supply: 1n },
            }
        });
    });
    it('should return wallet for LOKI only', () => {
        const wallet = {
            items: {
                [Token.LOKI]: { amount: 1n, supply: 2n },
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const wallet_by = walletFor(wallet, Token.LOKI);
        expect(wallet_by).toEqual({
            items: {
                [Token.LOKI]: { amount: 1n, supply: 2n },
            }
        });
    });
    it('should return wallet for ODIN only', () => {
        const wallet = {
            items: {
                [Token.ODIN]: { amount: 2n, supply: 3n },
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const wallet_by = walletFor(wallet, Token.ODIN);
        expect(wallet_by).toEqual({
            items: {
                [Token.ODIN]: { amount: 2n, supply: 3n },
            }
        });
    });
    it('should return wallet for HELA only', () => {
        const wallet = {
            items: {
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        };
        const wallet_by = walletFor(wallet, Token.HELA);
        expect(wallet_by).toEqual({
            items: {
                [Token.HELA]: { amount: 3n, supply: 4n },
            }
        });
    });
});
