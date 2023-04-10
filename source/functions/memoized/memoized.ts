/* eslint @typescript-eslint/no-explicit-any: [off] */
export type MemoizedKey = number | string | symbol;
export type Memoized<F extends (...args: any[]) => any> = {
    (...args: Parameters<F>): ReturnType<F>;
};
export function memoized<F extends (...args: any[]) => any>(
    fn: F, keyOf?: (...args: Parameters<F>) => MemoizedKey
): Memoized<F> {
    const cache = new Map<MemoizedKey, ReturnType<F>>();
    const memoized = function (
        this: any, ...args: Parameters<F>
    ): ReturnType<F> {
        const key = keyOf
            ? keyOf.apply(this, args) : JSON.stringify(args);
        const cached = cache.get(key);
        if (cached !== undefined) {
            return cached;
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
    return memoized as Memoized<F>;
}
export default memoized;
