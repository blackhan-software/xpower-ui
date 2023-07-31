import { Version } from '../types';
import * as parsers from './parsers';

export class ROParams {
    public static get autoMint() {
        return parsers.autoMint(this._search);
    }
    public static get clear() {
        return parsers.clear(this._search);
    }
    public static get clearAll() {
        return parsers.clearAll(this._search);
    }
    public static get color() {
        return parsers.color(this._search);
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
    public static get persist() {
        return parsers.persist(this._search);
    }
    public static get reloadMs() {
        return parsers.reloadMs(this._search);
    }
    public static service(name: string) {
        return parsers.service(this._search, name);
    }
    public static get version() {
        return parsers.version(this._search);
    }
    public static get versionTarget() {
        return parsers.versionTarget(this._search);
    }
    public static get versionFaked() {
        return parsers.versionFaked(this._search);
    }
    public static lt(version: Version): boolean {
        return this.version < version && !this.versionFaked;
    }
    public static lt2(lhs: Version, rhs: Version): boolean {
        return lhs < rhs && !this.versionFaked;
    }
    public static gt(version: Version): boolean {
        return this.version > version && !this.versionFaked;
    }
    public static gt2(lhs: Version, rhs: Version): boolean {
        return lhs > rhs && !this.versionFaked;
    }
    /**
     * @info initial location.search (of first load):
     */
    private static _search = new URLSearchParams(
        global.location?.search
    );
}
export default ROParams;
