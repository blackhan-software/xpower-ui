import { Amount, Supply, Token } from '../types';

export type SetWallet = {
    type: 'wallet/set', payload: {
        token: Token, item: {
            amount: Amount,
            supply: Supply
        }
    }
};
export const setWallet = (
    token: Token, item: {
        amount: Amount,
        supply: Supply
    }
): SetWallet => ({
    type: 'wallet/set', payload: {
        token, item
    }
});
export type IncreaseWallet = {
    type: 'wallet/increase', payload: {
        token: Token, item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const increaseWallet = (
    token: Token, item?: {
        amount: Amount, // new-amount = old-amount + amount
        supply?: Supply // new-supply = supply ?? old-supply + amount
    }
): IncreaseWallet => ({
    type: 'wallet/increase', payload: {
        token, item
    }
});
export type DecreaseWallet = {
    type: 'wallet/decrease', payload: {
        token: Token, item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const decreaseWallet = (
    token: Token, item?: {
        amount: Amount, // new-amount = old-amount - amount
        supply?: Supply // new-supply = supply ?? old-supply (*no* decrease!)
    }
): DecreaseWallet => ({
    type: 'wallet/decrease', payload: {
        token, item
    }
});
export type Action = SetWallet | IncreaseWallet | DecreaseWallet;
