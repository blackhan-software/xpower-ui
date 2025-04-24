import { ROParams } from '../../params';
import { Tokenizer } from '../../token';
import { Version } from '../../types';
import { Account } from './base';

export enum Token {
    XPOW = 'XPOW',
}
export enum Token {
    APOW = 'APOW',
}
export function XTokens(): Set<Token> {
    const ref = Token as typeof Token & {
        _xxx?: Set<Token>
    };
    if (ref._xxx === undefined) {
        ref._xxx = new Set(Object.values(Token).filter((t) => {
            return !t.startsWith('A');
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
            return t.startsWith('A');
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
    address: Account,
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
            address: BigInt($moe?.dataset.value ?? '0x0'),
            decimals: version < Version.v05a ? 0 : 18,
            image: String($image?.dataset.value),
            symbol: Tokenizer.xify(token),
        };
    } else {
        const atoken = Tokenizer.aify(token);
        const $sov = document.getElementById(
            `g-${atoken}_SOV_${version}`
        );
        const $image = document.getElementById(
            `g-${atoken}_SOV_IMAGE`
        );
        return {
            address: BigInt($sov?.dataset.value ?? '0x0'),
            decimals: 18,
            image: String($image?.dataset.value),
            symbol: Tokenizer.aify(token),
        };
    }
}
export function NFTokenInfo(
    token: Token, version?: Version
): Pick<TokenInfo, 'address'> {
    if (version === undefined) {
        version = ROParams.version;
    }
    const slug = version < Version.v06a
        ? Tokenizer.xify(token) : 'XPOW';
    const $nft = document.getElementById(
        `g-${slug}_NFT_${version}`
    );
    return {
        address: BigInt($nft?.dataset.value ?? '0x0'),
    };
}
export function PPTokenInfo(
    token: Token, version?: Version
): Pick<TokenInfo, 'address'> {
    if (version === undefined) {
        version = ROParams.version;
    }
    const slug = version < Version.v06a
        ? Tokenizer.aify(token) : 'APOW';
    const $sov = document.getElementById(
        `g-${slug}_NFT_${version}`
    );
    return {
        address: BigInt($sov?.dataset.value ?? '0x0'),
    };
}
