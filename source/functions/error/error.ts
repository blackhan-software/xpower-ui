/* eslint @typescript-eslint/no-explicit-any: [off] */
/**
 * @returns normalized exception
 */
export function error(ex: any) {
    /* eslint no-ex-assign: [off] */
    if (ex.error) {
        ex = ex.error;
    }
    if (ex.message) {
        if (ex.data && ex.data.message) {
            ex.message = `${ex.message} [${ex.data.message}]`;
        }
    }
    console.error(ex);
    return ex;
}
export default error;
