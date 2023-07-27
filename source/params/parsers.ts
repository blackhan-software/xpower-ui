import { Parser } from '../parser';
import { Level, NftLevel, NftLevels, Page, Token } from '../redux/types';
import { Tokenizer } from '../token';
import { Version, Versions } from '../types';
import { RWParams } from './rw-params';

export function autoMint(
    params: URLSearchParams
): number {
    return Parser.number(params.get('auto-mint'), 3000);
}
export function clear(
    params: URLSearchParams
): boolean {
    return Parser.boolean(params.get('clear'), false);
}
export function clearAll(
    params: URLSearchParams
): boolean {
    return Parser.boolean(params.get('clear-all'), false);
}
export function debug(
    params: URLSearchParams
): number {
    const flag = Parser.boolean(params.get('debug'), false);
    return Parser.number(params.get('debug'), flag ? 1 : 0);
}
export function level(
    params: URLSearchParams
): {
    min: Level, max: Level
} {
    const min = Parser.number(params.get('min-level'), 5);
    const max = Parser.number(params.get('max-level'), 64);
    return { min, max };
}
export function nftLevel(
    params: URLSearchParams
): {
    min: NftLevel, max: NftLevel
} {
    const min = Parser.number(
        params.get('min-nft-level'), NftLevel.UNIT
    );
    const max = Parser.number(
        params.get('max-nft-level'), NftLevel.TERA
    );
    return { min, max };
}
export function nftLevels(
    params: URLSearchParams
): NftLevel[] {
    const nft_levels = params.get('nft-levels');
    if (nft_levels !== null) {
        const all_levels = Array.from(NftLevels());
        const raw_levels = nft_levels.split(/[.,:;]/).filter((l) => l);
        return raw_levels.map(Number).filter((l) => all_levels.includes(l));
    }
    return [];
}
export function otfWallet(
    params: URLSearchParams
): boolean {
    return Parser.boolean(params.get('otf-wallet'), false);
}
export function logger(
    params: URLSearchParams
): boolean {
    return Parser.boolean(params.get('logger'), false);
}
export function persist(
    params: URLSearchParams
): number {
    const element = global.document?.getElementById('g-persistence');
    const fallback = Parser.number(element?.dataset.value, 0);
    return Parser.number(params.get('persist'), fallback);
}
export function reloadMs(
    params: URLSearchParams
): number | null {
    return Parser.number(params.get('reload-ms'), null);
}
export function service(
    params: URLSearchParams, name: string
): boolean {
    return Parser.boolean(params.get(`${name}-service`), RWParams.page !== Page.None);
}
export function speed(
    params: URLSearchParams
): number {
    const element = global.document?.getElementById('g-mining-speed');
    const fallback = Parser.number(element?.dataset.value, 50);
    const value = Parser.number(params.get('speed'), fallback);
    return Math.min(100, Math.max(0, value)) / 100;
}
export function token(
    params: URLSearchParams
): Token {
    return Tokenizer.token(params.get('token'));
}
export function version(
    params: URLSearchParams, value?: string | null, fallback = Version.v7c
): Version {
    if (value === undefined) {
        value = params.get('version');
    }
    if (value) {
        const version = value.slice(0, 3) as Version;
        if (Versions().has(version)) return version;
    }
    return fallback;
}
export function versionSource(
    params: URLSearchParams
): Version {
    return version(params, params.get('version-source'), Version.v7b);
}
export function versionTarget(
    params: URLSearchParams
): Version {
    return version(params, params.get('version-target'));
}
export function versionFaked(
    params: URLSearchParams
): boolean {
    return Boolean(params.get('version')?.match(/^v[0-9]+[a-z]+-(dev|faked?)$/));
}
