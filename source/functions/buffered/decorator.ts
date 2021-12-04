/* eslint @typescript-eslint/no-explicit-any: [off] */
import { buffered } from './buffered';
/**
 * Returns a buffered and cancelable version for the given class method.
 *
 * The buffered method does  *not*  get invoked,  before  the specified
 * delay in milliseconds passes,  no matter how much it gets invoked in
 * between. Also upon the invocation of the *actual* function a promise
 * is returned.  Further,  it is also possible to *cancel* a particular
 * invocation before the delay passes.
 *
 * @param ms delay in milliseconds
 * @returns a buffered function
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
            tpd.value = buffered(tpd.value, ms);
            return tpd;
        } else {
            tgt[key] = buffered(tgt[key], ms);
        }
    };
}
export default decorator;
