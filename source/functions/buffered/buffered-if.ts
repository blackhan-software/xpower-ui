/* eslint @typescript-eslint/no-explicit-any: [off] */
interface CancelableFunction<
    F extends (...args: any[]) => any
> {
    (this: any, ...args: Parameters<F>): Promise<ReturnType<F>>;
    cancel: () => void;
}
/**
 * Returns a buffered and cancelable version for the provided function,
 * with conditional buffering based on the provided predicate.
 *
 * @param fn an arbitrary function
 * @param iff predicate evaluator
 * @param ms delay in milliseconds
 * @returns a buffered function
 */
export function bufferedIf<F extends (...args: any[]) => any>(
    fn: F, iff: (...args: Parameters<F>) => any, ms = 200
) {
    let id: ReturnType<typeof setTimeout>;
    const bn = function (
        this: any, ...args: Parameters<F>
    ) {
        return new Promise((resolve) => {
            clearTimeout(id); id = setTimeout(() => resolve(
                fn ? fn.apply(this, args) : undefined
            ), iff(...args) ? ms : 0);
        });
    };
    (bn as CancelableFunction<F>).cancel = () => {
        clearTimeout(id);
    };
    return bn as CancelableFunction<F>;
}
export default bufferedIf;
