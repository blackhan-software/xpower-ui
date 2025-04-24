import { Version } from '../../types';
import { versionBy } from './version-by';

describe('version-by', () => {
    it('should return []', () => {
        const versions = versionBy({
            history: {
                items: {}
            }
        });
        expect(versions).toEqual([]);
    });
    it('should return ["v2a"]', () => {
        const versions = versionBy({
            history: {
                items: {
                    [Version.v02a]: {
                        moe: { balance: 1n }
                    },
                }
            }
        });
        expect(versions).toEqual([
            Version.v02a
        ]);
    });
    it('should return ["v3a", "v2a"]', () => {
        const versions = versionBy({
            history: {
                items: {
                    [Version.v02a]: {
                        moe: { balance: 1n }
                    },
                    [Version.v03a]: {
                        sov: { balance: 1n }
                    },
                }
            }
        });
        expect(versions).toEqual([
            Version.v03a, Version.v02a
        ]);
    });
    it('should return ["v4a", "v3a", "v2a"]', () => {
        const versions = versionBy({
            history: {
                items: {
                    [Version.v02a]: {
                        moe: { balance: 1n }
                    },
                    [Version.v03a]: {
                        sov: { balance: 1n }
                    },
                    [Version.v04a]: {
                        nft: { [2202100]: { balance: 1n} }
                    },
                }
            }
        });
        expect(versions).toEqual([
            Version.v04a, Version.v03a, Version.v02a
        ]);
    });
    it('should return ["v5a", "v4a", "v3a", "v2a"]', () => {
        const versions = versionBy({
            history: {
                items: {
                    [Version.v02a]: {
                        moe: { balance: 1n }
                    },
                    [Version.v03a]: {
                        sov: { balance: 1n }
                    },
                    [Version.v04a]: {
                        nft: { [2202100]: { balance: 1n} }
                    },
                    [Version.v05a]: {
                        ppt: { [2202100]: { balance: 1n} }
                    },
                }
            }
        });
        expect(versions).toEqual([
            Version.v05a, Version.v04a, Version.v03a, Version.v02a
        ]);
    });
});
