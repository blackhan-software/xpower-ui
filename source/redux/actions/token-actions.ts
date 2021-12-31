import { Amount, Supply, Token } from '../types';

export type SetToken = {
    type: 'token/set', payload: {
        token: Token, item: {
            amount: Amount,
            supply: Supply
        }
    }
};
export const setToken = (
    token: Token, item: {
        amount: Amount,
        supply: Supply
    }
): SetToken => ({
    type: 'token/set', payload: {
        token, item
    }
});
export type AddToken = {
    type: 'token/add', payload: {
        token: Token, item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const addToken = (
    token: Token, item?: {
        amount: Amount, // new-amount = old-amount + amount
        supply?: Supply // new-supply = supply ?? old-supply + amount
    }
): AddToken => ({
    type: 'token/add', payload: {
        token, item
    }
});
export type RemoveToken = {
    type: 'token/remove', payload: {
        token: Token, item?: {
            amount: Amount,
            supply?: Supply
        }
    }
};
export const removeToken = (
    token: Token, item?: {
        amount: Amount, // new-amount = old-amount - amount
        supply?: Supply // new-supply = supply ?? old-supply (*no* decrease!)
    }
): RemoveToken => ({
    type: 'token/remove', payload: {
        token, item
    }
});
export type Action = SetToken | AddToken | RemoveToken;
