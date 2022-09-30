import { Amount, Supply, Token } from '../types';

export type SetAftWallet = {
    type: 'aft-wallet/set', payload: {
        token: Token, item: {
            amount: Amount,
            supply: Supply
        }
    }
};
export const setAftWallet = (
    token: Token, item: {
        amount: Amount,
        supply: Supply
    }
): SetAftWallet => ({
    type: 'aft-wallet/set', payload: {
        token, item
    }
});
export type IncreaseAftWallet = {
    type: 'aft-wallet/increase', payload: {
        token: Token, item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const increaseAftWallet = (
    token: Token, item?: {
        amount: Amount, // new-amount = old-amount + amount
        supply?: Supply // new-supply = supply ?? old-supply + amount
    }
): IncreaseAftWallet => ({
    type: 'aft-wallet/increase', payload: {
        token, item
    }
});
export type DecreaseAftWallet = {
    type: 'aft-wallet/decrease', payload: {
        token: Token, item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const decreaseAftWallet = (
    token: Token, item?: {
        amount: Amount, // new-amount = old-amount - amount
        supply?: Supply // new-supply = supply ?? old-supply (*no* decrease!)
    }
): DecreaseAftWallet => ({
    type: 'aft-wallet/decrease', payload: {
        token, item
    }
});
export type Action = SetAftWallet | IncreaseAftWallet | DecreaseAftWallet;
