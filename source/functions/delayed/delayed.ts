/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/ban-types: [off] */
export interface CancelableFunction {
    (this: any, ...args: any[]): Promise<any>;
}
export interface CancelableFunction {
    cancel: () => void;
}
/**
 * Returns a delayed and cancelable version for the provided function.
 *
 * @param fn an arbitrary function
 * @param ms delay in milliseconds
 * @returns a delayed function
 */
export function delayed(
    fn: Function, ms = 200
): CancelableFunction {
    let id: ReturnType<typeof setTimeout>;
    const dn = function (
        this: any, ...args: any[]
    ): Promise<any> {
        return new Promise((resolve) => {
            id = setTimeout(() => resolve(fn.apply(this, args)), ms);
        });
    };
    (dn as CancelableFunction).cancel = () => {
        clearTimeout(id);
    };
    return dn as CancelableFunction;
}
export default delayed;
