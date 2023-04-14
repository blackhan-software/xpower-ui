/**
 * @returns [start...end)
 */
export function* range(start: number, end?: number, delta = 1) {
    if (typeof end === 'undefined') {
        end = start; start = 0;
    }
    for (let i = start; i < end; i += delta) {
        yield i;
    }
}
export default range;
