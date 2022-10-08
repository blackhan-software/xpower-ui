import { Params } from "../params";
import { Parser } from "../parser";
import { Token } from "../redux/types";
import { Tokenizer } from "../token";

export class URLQuery {
    static get otfWallet() {
        const params = new URLSearchParams(location.search);
        const toggled = params.get('otf-wallet');
        try {
            return Boolean(JSON.parse(toggled ?? 'false'))
        } catch (ex) {
            return false;
        }
    }
    static set otfWallet(toggled: boolean) {
        const params = new URLSearchParams(location.search);
        if (toggled) {
            params.set('otf-wallet', 'true');
        } else {
            params.delete('otf-wallet');
        }
        const search = params.toString();
        const prefix = search.length ? '?' : '';
        const [data, title, url] = [
            { page: 1 }, document.title,
            `${location.pathname}${prefix}${search}`
        ];
        history.pushState(data, title, url);
    }
    static get token() {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        return Tokenizer.token(token);
    }
    static set token(token: Token) {
        const params = new URLSearchParams(location.search);
        params.set('token', token);
        const [data, title, url] = [
            { page: 1 }, document.title,
            `${location.pathname}?${params}`
        ];
        history.pushState(data, title, url);
    }
    static get speed() {
        const params = new URLSearchParams(location.search);
        const speed = params.get('speed');
        return Parser.number(speed, Params.speed);
    }
    static set speed(speed: number) {
        const params = new URLSearchParams(location.search);
        if (speed !== 0.5 || params.get('speed') !== null) {
            params.set('speed', (100*speed).toFixed(1));
        }
        const [data, title, url] = [
            { page: 1 }, document.title,
            `${location.pathname}?${params}`
        ];
        history.pushState(data, title, url);
    }
}
export default URLQuery;
