/**
 * Rotates array to the left or to the right.
 *
 * @param a array to rotate
 * @param n positions to rotate by (positive or negative)
 * @returns rotated array
 */
export function rotate<T>(a: T[], n: number) {
    a.push(...a.splice(0, (-n % a.length + a.length) % a.length));
    return a;
}
export default rotate;
