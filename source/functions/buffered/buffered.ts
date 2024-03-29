/* eslint @typescript-eslint/no-explicit-any: [off] */
interface CancelableFunction<
    F extends (...args: any[]) => any
> {
    (this: any, ...args: Parameters<F>): Promise<ReturnType<F>>;
    cancel: () => void;
}
/**
 * Returns a buffered and cancelable version for the provided function.
 *
 * @param fn an arbitrary function
 * @param ms delay in milliseconds
 * @returns a buffered function
 */
export function buffered<F extends (...args: any[]) => any>(
    fn: F, ms = 200
) {
    let id: ReturnType<typeof setTimeout>;
    const bn = function (
        this: any, ...args: Parameters<F>
    ) {
        return new Promise((resolve) => {
            clearTimeout(id); id = setTimeout(() => resolve(
                fn ? fn.apply(this, args) : undefined
            ), ms);
        });
    };
    (bn as CancelableFunction<F>).cancel = () => {
        clearTimeout(id);
    };
    return bn as CancelableFunction<F>;
}
export default buffered;
