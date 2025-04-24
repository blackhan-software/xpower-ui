export enum Version {
    v01a = '01a',
    v02a = '02a',
    v02b = '02b',
    v02c = '02c',
    v03a = '03a',
    v03b = '03b',
    v04a = '04a',
    v05a = '05a',
    v05b = '05b',
    v05c = '05c',
    v06a = '06a',
    v06b = '06b',
    v06c = '06c',
    v07a = '07a',
    v07b = '07b',
    v07c = '07c',
    v08a = '08a',
    v08b = '08b',
    v08c = '08c',
    v09a = '09a',
    v09b = '09b',
    v09c = '09c',
    v10a = '10a',
}
export function Versions(): Set<Version> {
    const ref = Version as typeof Version & {
        _set?: Set<Version>
    };
    if (ref._set === undefined) {
        ref._set = new Set(Object.values(Version).filter((v) => {
            return v >= Version.v09c;
        }));
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
