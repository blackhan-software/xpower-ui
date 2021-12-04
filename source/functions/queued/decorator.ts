/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/no-unused-vars: [off] */
/* eslint @typescript-eslint/no-this-alias: [off] */
import { auto } from './queued';
/**
 * Queues class methods (or functions), and then starts dequeueing them for
 * invocation in the same sequence has they have been enqueued.
 *
 * @param auto flag to start auto dequeueing (defaults to `true`)
 */
export function decorator<T>(
    auto?: boolean,
): MethodDecorator;
/** @ignore */
export function decorator<T>(
    target: any, key: string | symbol, dtor?: PropertyDescriptor
): PropertyDescriptor | void;
/** @ignore */
export function decorator<T>(
    arg: boolean | any, key?: string | symbol, dtor?: PropertyDescriptor
): MethodDecorator | PropertyDescriptor | void {
    if (typeof arg === 'boolean') {
        return _decorator<T>(arg);
    } else {
        return _decorator<T>(true)(
            arg as any, key as string | symbol, dtor as PropertyDescriptor
        );
    }
}
function _decorator<T>(flag?: boolean): MethodDecorator {
    return (
        target: any, key: string | symbol, dtor?: PropertyDescriptor
    ): PropertyDescriptor | void => {
        if (dtor) {
            dtor.value = auto<T>(flag ?? true)(dtor.value);
            return dtor;
        } else {
            target[key] = auto<T>(flag ?? true)(target[key]);
        }
    };
}
export default decorator;
