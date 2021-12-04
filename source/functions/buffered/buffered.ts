/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/ban-types: [off] */
export interface CancelableFunction {
    (this: any, ...args: any[]): Promise<any>;
}
export interface CancelableFunction {
    cancel: () => void;
}
/**
 * Returns a buffered and cancelable version for the provided function.
 *
 * The buffered function does *not* get invoked,   before the specified
 * delay in milliseconds passes,  no matter how much it gets invoked in
 * between. Also upon the invocation of the *actual* function a promise
 * is returned.  Further,  it is also possible to *cancel* a particular
 * invocation before the delay passes.
 *
 * @param fn an arbitrary function
 * @param ms delay in milliseconds
 * @returns a buffered function
 */
export function buffered(
    fn: Function, ms = 200
): CancelableFunction {
    let id: ReturnType<typeof setTimeout>;
    const bn = function (
        this: any, ...args: any[]
    ): Promise<any> {
        return new Promise((resolve) => {
            clearTimeout(id); id = setTimeout(
                () => resolve(fn.apply(this, args)), ms,
            );
        });
    };
    (bn as CancelableFunction).cancel = () => {
        clearTimeout(id);
    };
    return bn as CancelableFunction;
}
export default buffered;
