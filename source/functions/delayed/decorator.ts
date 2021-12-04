/* eslint @typescript-eslint/no-explicit-any: [off] */
import { delayed } from './delayed';
/**
 * Returns a delayed and cancelable version for the given class method.
 *
 * @param ms delay in milliseconds
 * @returns a delayed function
 */
export function decorator(
    ms: number,
): MethodDecorator;
export function decorator(
    tgt: any, key: string | symbol, tpd?: PropertyDescriptor
): PropertyDescriptor | void;
export function decorator(
    arg: number | any, key?: string | symbol, tpd?: PropertyDescriptor
): MethodDecorator | PropertyDescriptor | void {
    if (typeof arg === 'number') {
        return _decorator(arg);
    } else {
        return _decorator()(
            arg as any,
            key as string | symbol,
            tpd as PropertyDescriptor
        );
    }
}
function _decorator(ms?: number): MethodDecorator {
    return (
        tgt: any, key: string | symbol, tpd?: PropertyDescriptor,
    ): PropertyDescriptor | void => {
        if (tpd) {
            tpd.value = delayed(tpd.value, ms);
            return tpd;
        } else {
            tgt[key] = delayed(tgt[key], ms);
        }
    };
}
export default decorator;
