export const trim = (text: string): string => text.trim();
export const nice = (
    n: number | bigint, { precision = 3, suffix = '' } = {}
): string => {
    const [text, frac] = split(n, precision);
    let result = frac + suffix;
    for (let i = text.length - 1; i >= 0; i--) {
        if ((text.length - i) % 3 === 0 && i > 0) {
            result = "'" + text[i] + result;
        } else {
            result = text[i] + result;
        }
    }
    return result;
};
const split = (
    n: number | bigint, precision: number
): [string, string] => {
    const [lhs, rhs] = n.toString().split('.');
    return [lhs, rhs ? '.' + rhs.slice(0, precision) : ''];
};
export const nice_si = (
    n: number | bigint, { precision = 3, base = 1 } = {}
): string => {
    if (n < 1e03 * base)
        return nice(rescale(n, 1e00) / base, { precision });
    if (n < 1e06 * base)
        return nice(rescale(n, 1e03) / base, { precision, suffix: 'K' });
    if (n < 1e09 * base)
        return nice(rescale(n, 1e06) / base, { precision, suffix: 'M' });
    if (n < 1e12 * base)
        return nice(rescale(n, 1e09) / base, { precision, suffix: 'G' });
    if (n < 1e15 * base)
        return nice(rescale(n, 1e12) / base, { precision, suffix: 'T' });
    if (n < 1e18 * base)
        return nice(rescale(n, 1e15) / base, { precision, suffix: 'P' });
    if (n < 1e21 * base)
        return nice(rescale(n, 1e18) / base, { precision, suffix: 'E' });
    if (n < 1e24 * base)
        return nice(rescale(n, 1e21) / base, { precision, suffix: 'Z' });
    if (n < 1e27 * base)
        return nice(rescale(n, 1e24) / base, { precision, suffix: 'Y' });
    return nice(BigInt(n) / BigInt(base), {
        precision
    });
};
const rescale = (
    n: number | bigint, by: number
): number => {
    if (typeof n === 'bigint') {
        return Number(n / BigInt(by)) + Number(n % BigInt(by)) / by;
    }
    return n / by;
};
export default {
    nice, nice_si, trim
};
