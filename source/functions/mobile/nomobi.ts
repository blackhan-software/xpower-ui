import { Global } from '../../types';
declare const global: Global;
/**
 * @returns `true` on desktop and else `false`; but, if a value is
 * provided then returns the value on desktop and else `undefined`
 */
export function nomobi<_>(value?: undefined): boolean;
export function nomobi<T>(value?: T): T | undefined;
export function nomobi<T>(value?: T) {
    if (global.UA_MOBILE === undefined) {
        global.UA_MOBILE = Boolean(
            global?.navigator?.userAgent?.match(/mobi/i)
        );
    }
    if (value !== undefined) {
        return !global.UA_MOBILE ? value : undefined;
    }
    return !global.UA_MOBILE;
}
export default nomobi;
