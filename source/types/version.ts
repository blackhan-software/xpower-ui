export enum Version {
    v1a = 'v1a',
    v2a = 'v2a',
    v2b = 'v2b',
    v2c = 'v2c',
    v3a = 'v3a',
    v3b = 'v3b',
    v4a = 'v4a',
    v5a = 'v5a',
    v5b = 'v5b',
    v5c = 'v5c',
    v6a = 'v6a',
    v6b = 'v6b',
    v6c = 'v6c',
    v7a = 'v7a',
    v7b = 'v7b',
    v7c = 'v7c',
    v8a = 'v8a',
    v8b = 'v8b',
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
export function VersionAt(index: number): Version {
    const versions = Array.from(Versions());
    if (index < 0) {
        index += versions.length;
    }
    return versions[index];
}
export default Version;
