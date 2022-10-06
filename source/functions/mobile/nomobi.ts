import { Global } from '../../types';
declare const global: Global;
/**
 * @returns `true` on desktop and else `false`, but if a text is
 * provided then returns the text on desktop and else `undefined`
 */
export function nomobi(text?: undefined): boolean;
export function nomobi(text?: string): string | undefined;
export function nomobi(text?: string) {
    if (global.UA_MOBILE === undefined) {
        global.UA_MOBILE = Boolean(
            global?.navigator?.userAgent?.match(/mobi/i)
        );
    }
    if (typeof text === 'string') {
        return !global.UA_MOBILE ? text : undefined;
    }
    return !global.UA_MOBILE;
}
export default nomobi;
