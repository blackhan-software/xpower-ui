/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint no-constant-condition: [off] */
export function zip<T extends any[]>(
    ...args: { [K in keyof T]: Iterable<T[K]> }
): T[] {
    const iters = args.map(a => [...a][Symbol.iterator]());
    const zippy = [] as T[];
    while (true) {
        const values = [] as T[number];
        for (let i = 0; i < iters.length; i++) {
            const { value, done } = iters[i].next();
            if (done === true) return zippy;
            values[i] = value as T[number];
        }
        zippy.push(values);
    }
}
export default zip;
