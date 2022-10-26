import { createAction } from '@reduxjs/toolkit';
import { AftWallet, Amount, Supply, Token } from '../types';

export const setAftWallet = createAction('aft-wallet/set', (
    token: Token, item: {
        amount: Amount, // new-amount = amount
        supply: Supply, // new-supply = supply
    }
) => ({
    payload: { token, item }
}));
export const increaseAftWallet = createAction('aft-wallet/increase', (
    token: Token, item?: {
        amount: Amount, // new-amount = old-amount + amount
        supply?: Supply // new-supply = supply ?? old-supply + amount
    }
) => ({
    payload: { token, item }
}));
export const decreaseAftWallet = createAction('aft-wallet/decrease', (
    token: Token, item?: {
        amount: Amount, // new-amount = old-amount - amount
        supply?: Supply // new-supply = supply ?? old-supply (*no* decrease!)
    }
) => ({
    payload: { token, item }
}));
export const setAftWalletBurner
    = createAction<Pick<AftWallet, 'burner'>>('aft-wallet/set-burner');
