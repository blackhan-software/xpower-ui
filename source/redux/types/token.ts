import { ROParams } from '../../params';
import { Tokenizer } from '../../token';
import { Version } from '../../types';
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
    /** address of token */
    address: Address,
    /** ticker symbol or shorthand */
    symbol: string,
    /** number of decimals of the token */
    decimals: number,
    /** string url of the token logo */
    image?: string
}
export function TokenInfo(
    token: Token, version?: Version
): TokenInfo {
    if (version === undefined) {
        version = ROParams.version;
    }
    const slug = Tokenizer.slug(token);
    const xtoken = Tokenizer.xify(token);
    const $moe = document.getElementById(
        `g-${xtoken}_${slug}_${version}`
    );
    const $symbol = document.getElementById(
        `g-${xtoken}_${slug}_SYMBOL_${version}`
    );
    const $decimals = document.getElementById(
        `g-${xtoken}_${slug}_DECIMALS_${version}`
    );
    const $image = document.getElementById(
        `g-${xtoken}_${slug}_IMAGE_${version}`
    );
    return {
        address: BigInt($moe?.dataset.value as string),
        symbol: String($symbol?.dataset.value),
        decimals: Number($decimals?.dataset.value),
        image: String($image?.dataset.value)
    };
}
