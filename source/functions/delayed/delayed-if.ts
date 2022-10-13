/* eslint @typescript-eslint/no-explicit-any: [off] */
interface CancelableFunction<
    F extends (...args: any[]) => any
> {
    (this: any, ...args: Parameters<F>): Promise<ReturnType<F>>;
    cancel: () => void;
}
/**
 * Returns a delayed and cancelable version for the provided function,
 * with conditional delaying based on the provided predicate.
 *
 * @param fn an arbitrary function
 * @param iff predicate evaluator
 * @param ms delay in milliseconds
 * @returns a delayed function
 */
export function delayedIf<F extends (...args: any[]) => any>(
    fn: F, iff: (...args: Parameters<F>) => any, ms = 200
) {
    let id: ReturnType<typeof setTimeout>;
    const dn = function (
        this: any, ...args: Parameters<F>
    ) {
        return new Promise((resolve) => {
            id = setTimeout(() => resolve(
                fn ? fn.apply(this, args) : undefined
            ), iff(...args) ? ms : 0);
        });
    };
    (dn as CancelableFunction<F>).cancel = () => {
        clearTimeout(id);
    };
    return dn as CancelableFunction<F>;
}
export default delayedIf;
