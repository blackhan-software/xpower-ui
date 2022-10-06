import { Global } from '../../types';
declare const global: Global;
/**
 * @returns `true` on mobile and else `false`, but if a text is
 * provided then returns the text on mobile and else `undefined`
 */
export function mobile(text?: undefined): boolean;
export function mobile(text?: string): string | undefined;
export function mobile(text?: string) {
    if (global.UA_MOBILE === undefined) {
        global.UA_MOBILE = Boolean(
            global?.navigator?.userAgent?.match(/mobi/i)
        );
    }
    if (typeof text === 'string') {
        return global.UA_MOBILE ? text : undefined;
    }
    return global.UA_MOBILE;
}
export default mobile;
