/* eslint @typescript-eslint/no-explicit-any: [off] */
export type MemoizedKey = number | string | symbol;
export type Memoized<F extends (...args: any[]) => any> = {
    (...args: Parameters<F>): ReturnType<F>;
};
export function memoized<F extends (...args: any[]) => any>(
    fn: F, keyOf?: (...args: Parameters<F>) => MemoizedKey,
    getCache?: () => Map<MemoizedKey, ReturnType<F>>
): Memoized<F> {
    if (getCache === undefined) {
        getCache = () => new Map<MemoizedKey, ReturnType<F>>();
    }
    const cache = getCache();
    const memoized = async function (
        this: any, ...args: Parameters<F>
    ): Promise<ReturnType<F>> {
        const key = keyOf
            ? keyOf.apply(this, args) : JSON.stringify(args);
        const cached = cache.get(key);
        if (cached !== undefined) {
            return cached;
        }
        const result = await fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
    return memoized as Memoized<F>;
}
export class LocalStorage<K extends string, V> extends Map<K, V> {
    get(key: K): V | undefined {
        const item = localStorage.getItem(key);
        if (item !== null) return JSON.parse(item);
    }
    set(key: K, value: V) {
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
        return this;
    }
    delete(key: K): boolean {
        const item = localStorage.getItem(key);
        localStorage.removeItem(key);
        return item !== null;
    }
    has(key: K): boolean {
        const item = localStorage.getItem(key);
        return item !== null;
    }
    clear() {
        localStorage.clear();
    }
}
export default memoized;
