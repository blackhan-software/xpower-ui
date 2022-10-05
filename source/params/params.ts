import { Pager } from '../redux/types';
import * as parsers from './parsers';

export class Params {
    public static get autoMint() {
        return parsers.autoMint(this.search);
    }
    public static get clear() {
        return parsers.clear(this.search);
    }
    public static get clearAll() {
        return parsers.clearAll(this.search);
    }
    public static get debug() {
        return parsers.debug(this.search);
    }
    public static get level() {
        return parsers.level(this.search);
    }
    public static get logger() {
        return parsers.logger(this.search);
    }
    public static get nftLevel() {
        return parsers.nftLevel(this.search);
    }
    public static get page() {
        return Pager.parse(global.location?.pathname ?? null);
    }
    public static get persist() {
        return parsers.persist(this.search);
    }
    public static get reloadMs() {
        return parsers.reloadMs(this.search);
    }
    public static get speed() {
        return parsers.speed(this.search);
    }
    public static get token() {
        return parsers.token(this.search);
    }
    public static get version() {
        return parsers.version(this.search);
    }
    private static get search() {
        return new URLSearchParams(this._search?.substring(1));
    }
    private static _search = global.location?.search;
}
export default Params;
