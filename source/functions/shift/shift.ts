/**
 * Shifts array to the left or to the right, while repeating the
 * head or tail values (depending on direction of the shift).
 *
 * @param a array to shift
 * @param n position to shift by (positive or negative)
 * @returns shifted array
 */
export function shift<T>(a: T[], n: number) {
    if (a.length) {
        n = n % a.length;
    } else {
        return a;
    }
    if (n > 0) {
        a.splice(a.length - n, a.length);
        a.unshift(...Array(n).fill(a[0]));
        return a;
    }
    if (n < 0) {
        a.splice(0, -n);
        a.push(...Array(-n).fill(a[a.length - 1]));
        return a;
    }
    return a;
}
export default shift;
