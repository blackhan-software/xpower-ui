export function ensure<T>(
    predicate: () => T, poll = 0, timeout = 600
): Promise<T> {
    const result = predicate();
    if (result !== undefined) {
        return Promise.resolve(result);
    }
    return new Promise((resolve, reject) => {
        const tid = setTimeout(() => {
            clearInterval(iid);
            reject(new Error(
                'ensure timeout'
            ));
        }, timeout);
        const iid = setInterval(() => {
            const result = predicate();
            if (result !== undefined) {
                clearInterval(iid);
                clearTimeout(tid);
                resolve(result);
            }
        }, poll);
    });
}
export default ensure;
