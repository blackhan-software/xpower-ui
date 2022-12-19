export enum Version {
    'v2a' = 'v2a',
    'v3a' = 'v3a',
    'v3b' = 'v3b',
    'v4a' = 'v4a',
    'v5a' = 'v5a',
    'v5b' = 'v5b',
    'v5c' = 'v5c',
    'v6a' = 'v6a',
}
export function Versions(): Set<Version> {
    const ref = Version as typeof Version & {
        _set?: Set<Version>
    };
    if (ref._set === undefined) {
        ref._set = new Set(Object.values(Version));
    }
    return ref._set;
}

export default Version;
