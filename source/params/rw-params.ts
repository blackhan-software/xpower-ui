import { Level, NftLevel, Page, Pager, Token } from '../redux/types';
import { DEX, Version } from '../types';
import * as parsers from './parsers';
import { ROParams } from './ro-params';

export class RWParams {
    static get dex() {
        return parsers.dex(this.search());
    }
    static set dex(value: DEX | URL) {
        const search = this.search();
        if (value !== DEX.paraswap) {
            search.set('dex', value.toString());
        } else {
            search.delete('dex');
        }
        this.push({ search });
    }
    static get level() {
        return parsers.level(this.search());
    }
    static set level({ mint }: {
        mint?: Level
    }) {
        const search = this.search();
        if (mint !== undefined) {
            const { mint: old } = this.level;
            if (mint !== old) {
                if (mint !== ROParams.level.min) {
                    search.set('mint-level', mint.toString());
                } else {
                    search.delete('mint-level');
                }
            }
        }
        this.push({ search });
    }
    public static get nftLevels() {
        return parsers.nftLevels(this.search());
    }
    public static set nftLevels(levels: NftLevel[]) {
        const search = this.search();
        if (levels.length > 0) {
            search.set('nft-levels', levels.join('.'));
        } else {
            search.delete('nft-levels');
        }
        this.push({ search });
    }
    static get otfWallet() {
        return parsers.otfWallet(this.search());
    }
    static set otfWallet(value: boolean) {
        const search = this.search();
        if (value) {
            search.set('otf-wallet', 'true');
        } else {
            search.delete('otf-wallet');
        }
        this.push({ search });
    }
    static get page() {
        return Pager.parse(this.pathname());
    }
    static set page(value: Page) {
        this.push({ pathname: '/' + value });
    }
    static get speed() {
        return parsers.speed(this.search());
    }
    static set speed(value: number) {
        const search = this.search();
        if (value !== 0.5 || search.get('speed') !== null) {
            value = Math.min(100, Math.max(0, 100 * value));
            if (value !== 50) {
                search.set('speed', value.toFixed(1));
            } else {
                search.delete('speed');
            }
        }
        this.push({ search });
    }
    static get token() {
        return parsers.token(this.search());
    }
    static set token(value: Token) {
        const search = this.search();
        search.set('token', value);
        this.push({ search });
    }
    public static get versionSource() {
        return parsers.versionSource(this.search());
    }
    public static set versionSource(value: Version) {
        const search = this.search();
        search.set('version-source', value);
        this.push({ search });
    }
    private static pathname(): string | null {
        return global.location?.pathname ?? null;
    }
    private static search() {
        const search = global.location?.search;
        return new URLSearchParams(search);
    }
    private static hash() {
        return global.location?.hash ?? '';
    }
    private static push({ pathname, search, hash }: {
        pathname?: string, search?: URLSearchParams, hash?: string
    }) {
        if (pathname === undefined) {
            pathname = location.pathname;
        }
        if (search === undefined) {
            search = this.search();
        }
        if (hash === undefined) {
            hash = this.hash();
        }
        const search_px = `${search}`.length ? '?' : '';
        const [data, title, url] = [
            { page: 1 }, document.title,
            `${pathname}${search_px}${search}${hash}`
        ];
        history.pushState(data, title, url);
    }
}
export default RWParams;
