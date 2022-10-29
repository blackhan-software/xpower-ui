export function nice(
    n: number | bigint, { precision = 3, base = 1, suffix = '' } = {}
): string {
    const [text, frac] = split(rescale(n, base), precision);
    let result = frac + suffix;
    for (let i = text.length - 1; i >= 0; i--) {
        if ((text.length - i) % 3 === 0 && i > 0) {
            result = "'" + text[i] + result;
        } else {
            result = text[i] + result;
        }
    }
    return result;
}
function rescale(
    n: number | bigint, by: number
): number {
    return typeof n === 'bigint'
        ? Number(n / BigInt(by)) + Number(n % BigInt(by)) / by : n / by;
}
function split(
    n: number, precision: number
): [string, string] {
    const [lhs, rhs] = n.toFixed(precision).split('.');
    while (precision > 0 && rhs[precision - 1] === '0') { precision--; }
    return [lhs, rhs ? (precision ? '.' : '') + rhs.slice(0, precision) : ''];
}
export default nice;
