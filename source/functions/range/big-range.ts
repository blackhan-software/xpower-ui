/**
 * @returns [start...end)
 */
export function* big_range(
    start: bigint | number,
    end?: bigint | number
) {
    if (typeof start === 'number') {
        start = BigInt(start);
    }
    if (typeof end === 'number') {
        end = BigInt(end);
    }
    if (typeof end === 'undefined') {
        end = start; start = 0n;
    }
    for (let i = start; i < end; i++) {
        yield i;
    }
}
export default big_range;
