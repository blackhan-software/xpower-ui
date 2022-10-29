import nice from './nice';

export function nice_si(
    n: number | bigint, { precision = 3, base = 1 } = {}
): string {
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
    if (typeof n === 'bigint') {
        return (n / BigInt(base)).toLocaleString('en-US', {
            notation: 'scientific', maximumFractionDigits: digits(precision)
        });
    } else {
        return (n / base).toLocaleString('en-US', {
            notation: 'scientific', maximumFractionDigits: digits(precision)
        });
    }
}
function rescale(
    n: number | bigint, by: number
): number {
    return typeof n === 'bigint'
        ? Number(n / BigInt(by)) + Number(n % BigInt(by)) / by : n / by;
}
function digits(
    precision: number
) {
    switch (Math.round(precision)) {
        case 0: return 0;
        case 1: return 1;
        case 2: return 2;
        case 3: return 3;
        case 4: return 4;
        case 5: return 5;
        case 6: return 6;
        case 7: return 7;
        case 8: return 8;
        case 9: return 9;
        case 10: return 10;
        case 11: return 11;
        case 12: return 12;
        case 13: return 13;
        case 14: return 14;
        case 15: return 15;
        case 16: return 16;
        case 17: return 17;
        case 18: return 18;
        case 19: return 19;
        case 20: return 20;
    }
    return undefined;
}
export default nice_si;
