import { Version } from '../../types';
import { Token } from '../types';
import { versionBy } from './version-by';

describe('version-by', () => {
    const token = Token.XPOW;
    it('should return []', () => {
        const versions = versionBy({
            history: {
                items: {}
            }
        }, token);
        expect(versions).toEqual([]);
    });
    it('should return ["v2a"]', () => {
        const versions = versionBy({
            history: {
                items: {
                    [Version.v2a]: {
                        [Token.XPOW]: {
                            moe: { balance: 1n }
                        }
                    },
                }
            }
        }, token);
        expect(versions).toEqual([
            Version.v2a
        ]);
    });
    it('should return ["v3a", "v2a"]', () => {
        const versions = versionBy({
            history: {
                items: {
                    [Version.v2a]: {
                        [Token.XPOW]: {
                            moe: { balance: 1n }
                        }
                    },
                    [Version.v3a]: {
                        [Token.XPOW]: {
                            sov: { balance: 1n }
                        }
                    },
                }
            }
        }, token);
        expect(versions).toEqual([
            Version.v3a, Version.v2a
        ]);
    });
    it('should return ["v4a", "v3a", "v2a"]', () => {
        const versions = versionBy({
            history: {
                items: {
                    [Version.v2a]: {
                        [Token.XPOW]: {
                            moe: { balance: 1n }
                        }
                    },
                    [Version.v3a]: {
                        [Token.XPOW]: {
                            sov: { balance: 1n }
                        }
                    },
                    [Version.v4a]: {
                        [Token.XPOW]: {
                            nft: { [2202100]: { balance: 1n} }
                        }
                    },
                }
            }
        }, token);
        expect(versions).toEqual([
            Version.v4a, Version.v3a, Version.v2a
        ]);
    });
    it('should return ["v5a", "v4a", "v3a", "v2a"]', () => {
        const versions = versionBy({
            history: {
                items: {
                    [Version.v2a]: {
                        [Token.XPOW]: {
                            moe: { balance: 1n }
                        }
                    },
                    [Version.v3a]: {
                        [Token.XPOW]: {
                            sov: { balance: 1n }
                        }
                    },
                    [Version.v4a]: {
                        [Token.XPOW]: {
                            nft: { [2202100]: { balance: 1n} }
                        }
                    },
                    [Version.v5a]: {
                        [Token.XPOW]: {
                            ppt: { [2202100]: { balance: 1n} }
                        }
                    },
                }
            }
        }, token);
        expect(versions).toEqual([
            Version.v5a, Version.v4a, Version.v3a, Version.v2a
        ]);
    });
});
