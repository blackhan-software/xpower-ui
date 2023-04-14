export function normalize(
    value: bigint | number
) {
    if (typeof value === 'bigint') {
        return Number(value) / 1000;
    }
    return value / 1000;
}
export default normalize;
