/* eslint @typescript-eslint/no-var-requires: [off] */
/* eslint @typescript-eslint/no-unused-vars: [off] */
interface StringConstructor {
    random(bytes?: number, encoding?: string): string;
}
/**
 * Attaches to the `String` type a `random` function which returns a random
 * string for the provided number of bytes and encoding.
 *
 * @param bytes
 *  number of random bytes with `16` as default
 * @param encoding
 *  encoding of random string with `hex` as default. Possible encodings are
 *  `ascii`, `base64`, `hex`, `latin1`, and `ucs2`.
 *
 * @returns a random string
 */
String.random = (bytes = 16, encoding = 'hex'): string => {
    return require('randombytes')(bytes).toString(encoding);
};
