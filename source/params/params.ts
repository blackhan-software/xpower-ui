import { Pager } from '../redux/types';
import * as parsers from './parsers';

export class Params {
    public static get autoMint() {
        return parsers.autoMint(this._search);
    }
    public static get clear() {
        return parsers.clear(this._search);
    }
    public static get clearAll() {
        return parsers.clearAll(this._search);
    }
    public static get debug() {
        return parsers.debug(this._search);
    }
    public static get level() {
        return parsers.level(this._search);
    }
    public static get logger() {
        return parsers.logger(this._search);
    }
    public static get nftLevel() {
        return parsers.nftLevel(this._search);
    }
    public static get page() {
        return Pager.parse(global.location?.pathname ?? null);
    }
    public static get persist() {
        return parsers.persist(this._search);
    }
    public static get reloadMs() {
        return parsers.reloadMs(this._search);
    }
    public static service(name: string) {
        return parsers.service(this._search, name);
    }
    public static get speed() {
        return parsers.speed(this._search);
    }
    public static get token() {
        return parsers.token(this._search);
    }
    public static get version() {
        return parsers.version(this._search);
    }
    /**
     * @info initial search query at first load:
     */
    private static _search = new URLSearchParams(
        global.location?.search
    );
}
export default Params;
