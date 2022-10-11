import { Page, Pager, Token } from '../redux/types';
import * as parsers from './parsers';

export class RWParams {
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
            search.set('speed', value.toFixed(1));
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
    private static pathname(): string | null {
        return global.location?.pathname ?? null;
    }
    private static search() {
        const search = global.location?.search;
        return new URLSearchParams(search);
    }
    private static push({ search, pathname }: {
        search?: URLSearchParams, pathname?: string
    }) {
        if (search === undefined) {
            search = this.search();
        }
        if (pathname === undefined) {
            pathname = location.pathname;
        }
        const string = search.toString();
        const prefix = string.length ? '?' : '';
        const [data, title, url] = [
            { page: 1 }, document.title,
            `${pathname}${prefix}${search}`
        ];
        history.pushState(data, title, url);
    }
}
export default RWParams;
