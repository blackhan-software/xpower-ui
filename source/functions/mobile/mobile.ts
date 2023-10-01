import { Global } from '../../types';
declare const global: Global;
/**
 * @returns `true` on mobile and else `false`; but, if a value is
 * provided then returns the value on mobile and else `undefined`
 */
export function mobile<_>(value?: undefined): boolean;
export function mobile<T>(value?: T): T | undefined;
export function mobile<T>(value?: T) {
    if (global.UA_MOBILE === undefined) {
        global.UA_MOBILE = Boolean(
            global?.navigator?.userAgent?.match(/mobi/i)
        );
    }
    if (value !== undefined) {
        return global.UA_MOBILE ? value : undefined;
    }
    return global.UA_MOBILE;
}
export default mobile;
