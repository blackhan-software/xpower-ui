import { Token } from '../redux/types';
import * as parsers from './parsers';

export class URLQuery {
    static get otfWallet() {
        return parsers.otfWallet(this.getSearch());
    }
    static set otfWallet(value: boolean) {
        const search = this.getSearch();
        if (value) {
            search.set('otf-wallet', 'true');
        } else {
            search.delete('otf-wallet');
        }
        this.push(search);
    }
    static get token() {
        return parsers.token(this.getSearch());
    }
    static set token(value: Token) {
        const search = this.getSearch();
        search.set('token', value);
        this.push(search);
    }
    static get speed() {
        return parsers.speed(this.getSearch());
    }
    static set speed(value: number) {
        const search = this.getSearch();
        if (value !== 0.5 || search.get('speed') !== null) {
            value = Math.min(100, Math.max(0, 100 * value));
            search.set('speed', value.toFixed(1));
        }
        this.push(search);
    }
    private static getSearch() {
        const search = global.location?.search;
        return new URLSearchParams(search);
    }
    private static push(search: URLSearchParams) {
        const string = search.toString();
        const prefix = string.length ? '?' : '';
        const [data, title, url] = [
            { page: 1 }, document.title,
            `${location.pathname}${prefix}${search}`
        ];
        history.pushState(data, title, url);
    }
}
export default URLQuery;
