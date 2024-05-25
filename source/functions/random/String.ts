/* eslint @typescript-eslint/no-require-imports: [off] */
/* eslint @typescript-eslint/no-unused-vars: [off] */
interface StringConstructor {
    random(bytes?: number): string;
}
/**
 * Attaches to the `String` type a `random` function which returns a random
 * string for the provided number of bytes.
 *
 * @param bytes
 *  number of random bytes with `16` as default
 * @returns a random string
 */
String.random = (bytes = 16): string => {
    return '0x' + Array.from(require('ethers').randomBytes(bytes))
        .map((b) => Number(b).toString(16))
        .map((s) => s.padStart(2, '0'))
        .join('');
};
