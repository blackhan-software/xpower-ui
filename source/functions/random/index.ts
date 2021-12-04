import './String';
/**
 * Attaches to the `String` type a `random` function which returns a random
 * string for the provided number of bytes and encoding.
 *
 * @param bytes
 *  number of random bytes with `16` as default
 * @param encoding
 *  encoding of random string with `hex` as default
 *
 * @returns a random string
 */
export function random(bytes = 16, encoding = 'hex'): string {
    return String.random(bytes, encoding);
}
export default random;
