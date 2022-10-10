export function testing() {
    if (typeof process !== 'undefined' &&
        typeof process.env !== 'undefined' &&
        typeof process.env.NODE_ENV !== 'undefined'
    ) {
        return !!process.env.NODE_ENV.match(/^test$/i);
    }
    return false;
}
export default testing;
