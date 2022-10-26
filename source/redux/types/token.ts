import { Address } from './base';

export enum Token {
    THOR = 'THOR',
    LOKI = 'LOKI',
    ODIN = 'ODIN',
    HELA = 'HELA',
}
export enum Token {
    aTHOR = 'aTHOR',
    aLOKI = 'aLOKI',
    aODIN = 'aODIN',
    aHELA = 'aHELA',
}
export function XTokens(): Set<Token> {
    const ref = Token as typeof Token & {
        _set?: Set<Token>
    };
    if (ref._set === undefined) {
        ref._set = new Set(Object.values(Token).filter((t) => {
            return !t.startsWith('a');
        }));
    }
    return ref._set;
}
export function ATokens(): Set<Token> {
    const ref = Token as typeof Token & {
        _set?: Set<Token>
    };
    if (ref._set === undefined) {
        ref._set = new Set(Object.values(Token).filter((t) => {
            return t.startsWith('a');
        }));
    }
    return ref._set;
}
export function Tokens(): Set<Token> {
    const ref = Token as typeof Token & {
        _set?: Set<Token>
    };
    if (ref._set === undefined) {
        ref._set = new Set(Object.values(Token));
    }
    return ref._set;
}
export type TokenInfo = {
    /** address the token is at */
    address: Address,
    /** ticker symbol or shorthand */
    symbol: string,
    /** number of decimals of the token */
    decimals: number,
    /** string url of the token logo */
    image?: string
};
