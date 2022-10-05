/* eslint @typescript-eslint/no-explicit-any: [off] */
/**
 * @returns all leaf keys (if value is defined)
 */
 export function leafKeys (
    record: Record<string, any>, keys: string[] = []
) {
    const record_keys = Object.keys(record);
    for (const key of record_keys) {
        const item = record[key];
        if (typeof item === 'object') {
            if (item !== null) {
                leafKeys(record[key], keys);
            }
            continue;
        }
        if (item !== undefined) {
            keys.push(key);
        }
    }
    return keys;
}
export default leafKeys;
