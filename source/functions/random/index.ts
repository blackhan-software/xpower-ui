import './String';
/**
 * Attaches to the `String` type a `random` function which returns a random
 * string for the provided number of bytes.
 *
 * @param bytes
 *  number of random bytes with `16` as default
 * @returns a random string
 */
export function random(bytes = 16): string {
    return String.random(bytes);
}
export default random;
