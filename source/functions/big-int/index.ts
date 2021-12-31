export function max(
    lhs: bigint, rhs: bigint
) {
    return lhs > rhs ? lhs : rhs;
}
export function min(
    lhs: bigint, rhs: bigint
) {
    return lhs < rhs ? lhs : rhs;
}
export function hex(
    value: bigint | number
) {
    const string = value.toString(16);
    return '0x' + string;
}
export function hex_40(
    value: bigint | number, min_length = 40
) {
    const string = value.toString(16);
    const length = min_length - string.length;
    if (length > 0) {
        return `0x${'0'.repeat(length)}` + string;
    }
    return '0x' + string;
}
export function hex_64(
    value: bigint | number, min_length = 64
) {
    const string = value.toString(16);
    const length = min_length - string.length;
    if (length > 0) {
        return `0x${'0'.repeat(length)}` + string;
    }
    return '0x' + string;
}
