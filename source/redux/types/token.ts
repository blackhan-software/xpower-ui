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
        _xxx?: Set<Token>
    };
    if (ref._xxx === undefined) {
        ref._xxx = new Set(Object.values(Token).filter((t) => {
            return !t.startsWith('a');
        }));
    }
    return ref._xxx;
}
export function ATokens(): Set<Token> {
    const ref = Token as typeof Token & {
        _aaa?: Set<Token>
    };
    if (ref._aaa === undefined) {
        ref._aaa = new Set(Object.values(Token).filter((t) => {
            return t.startsWith('a');
        }));
    }
    return ref._aaa;
}
export function Tokens(): Set<Token> {
    const ref = Token as typeof Token & {
        _all?: Set<Token>
    };
    if (ref._all === undefined) {
        ref._all = new Set(Object.values(Token));
    }
    return ref._all;
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
    if (Tokenizer.slug(token) === 'MOE') {
        const xtoken = Tokenizer.xify(token);
        const $moe = document.getElementById(
            `g-${xtoken}_MOE_${version}`
        );
        const $image = document.getElementById(
            `g-${xtoken}_MOE_IMAGE`
        );
        return {
            address: BigInt($moe?.dataset.value as string),
            decimals: version < Version.v5a ? 0 : 18,
            image: String($image?.dataset.value),
            symbol: Tokenizer.xify(token),
        };
    } else {
        const xtoken = Tokenizer.xify(token);
        const $sov = document.getElementById(
            `g-${xtoken}_SOV_${version}`
        );
        const $image = document.getElementById(
            `g-${xtoken}_SOV_IMAGE`
        );
        return {
            address: BigInt($sov?.dataset.value as string),
            decimals: 18,
            image: String($image?.dataset.value),
            symbol: Tokenizer.aify(token),
        };
    }
}
