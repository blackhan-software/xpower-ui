import { Parser } from '../parser';
import { Level, NftLevel, Token } from '../redux/types';
import { Tokenizer } from '../token';
import { Version } from '../types';

export function autoMint(params: URLSearchParams): number {
    return Parser.number(params.get('auto-mint'), 3000);
}
export function clear(params: URLSearchParams): boolean {
    return Parser.boolean(params.get('clear'), false);
}
export function clearAll(params: URLSearchParams): boolean {
    return Parser.boolean(params.get('clear-all'), false);
}
export function debug(params: URLSearchParams): boolean {
    return Parser.boolean(params.get('debug'), false);
}
export function level(params: URLSearchParams): {
    min: Level, max: Level
} {
    const min = Parser.number(params.get('min-level'), 5);
    const max = Parser.number(params.get('max-level'), 64);
    return { min, max };
}
export function nftLevel(params: URLSearchParams): {
    min: NftLevel, max: NftLevel
} {
    const min = Parser.number(
        params.get('min-nft-level'), NftLevel.UNIT
    );
    const max = Parser.number(
        params.get('max-nft-level'), NftLevel.PETA
    );
    return { min, max };
}
export function otfWallet(params: URLSearchParams): boolean {
    return Parser.boolean(params.get('otf-wallet'), false);
}
export function logger(params: URLSearchParams): boolean {
    return Parser.boolean(params.get('logger'), false);
}
export function persist(params: URLSearchParams): number {
    const element = global.document?.getElementById('g-persistence');
    const fallback = Parser.number(element?.dataset.value, 0);
    return Parser.number(params.get('persist'), fallback);
}
export function reloadMs(params: URLSearchParams): number | null {
    return Parser.number(params.get('reload-ms'), null);
}
export function service(params: URLSearchParams, name: string): boolean {
    return Parser.boolean(params.get(`${name}-service`), true);
}
export function speed(params: URLSearchParams): number {
    const element = global.document?.getElementById('g-mining-speed');
    const fallback = Parser.number(element?.dataset.value, 50);
    const value = Parser.number(params.get('speed'), fallback);
    return Math.min(100, Math.max(0, value)) / 100;
}
export function token(params: URLSearchParams): Token {
    return Tokenizer.token(params.get('token'));
}
export function version(
    params: URLSearchParams, value?: string | null, fallback = Version.v5c
): Version {
    if (value === undefined) {
        value = params.get('version');
    }
    switch (value) {
        case 'v2a':
            return Version.v2a;
        case 'v3a':
            return Version.v3a;
        case 'v3b':
            return Version.v3b;
        case 'v4a':
            return Version.v4a;
        case 'v5a':
            return Version.v5a;
        case 'v5b':
            return Version.v5b;
        case 'v5c':
            return Version.v5c;
        default:
            return fallback;
    }
}
export function versionSource(params: URLSearchParams): Version {
    return version(params, params.get('version-source'), Version.v5a);
}
export function versionTarget(params: URLSearchParams): Version {
    return version(params, params.get('version-target'));
}
