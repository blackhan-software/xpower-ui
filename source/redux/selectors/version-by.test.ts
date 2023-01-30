import { Version } from '../../types';
import { Token } from '../types';
import { versionBy } from './version-by';

describe('version-by', () => {
    const token = Token.THOR;
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
                        [Token.THOR]: {
                            moe: { balance: 1n }
                        }
                    },
                    [Version.v6b]: {
                        [Token.LOKI]: {
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
                        [Token.THOR]: {
                            moe: { balance: 1n }
                        }
                    },
                    [Version.v6b]: {
                        [Token.LOKI]: {
                            moe: { balance: 1n }
                        }
                    },
                    [Version.v3a]: {
                        [Token.THOR]: {
                            sov: { balance: 1n }
                        }
                    },
                    [Version.v6b]: {
                        [Token.LOKI]: {
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
                        [Token.THOR]: {
                            moe: { balance: 1n }
                        }
                    },
                    [Version.v6b]: {
                        [Token.LOKI]: {
                            moe: { balance: 1n }
                        }
                    },
                    [Version.v3a]: {
                        [Token.THOR]: {
                            sov: { balance: 1n }
                        }
                    },
                    [Version.v6b]: {
                        [Token.LOKI]: {
                            sov: { balance: 1n }
                        }
                    },
                    [Version.v4a]: {
                        [Token.THOR]: {
                            nft: { [1202100]: { balance: 1n} }
                        }
                    },
                    [Version.v6b]: {
                        [Token.LOKI]: {
                            nft: { [1202100]: { balance: 1n} }
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
                        [Token.THOR]: {
                            moe: { balance: 1n }
                        }
                    },
                    [Version.v6b]: {
                        [Token.LOKI]: {
                            moe: { balance: 1n }
                        }
                    },
                    [Version.v3a]: {
                        [Token.THOR]: {
                            sov: { balance: 1n }
                        }
                    },
                    [Version.v6b]: {
                        [Token.LOKI]: {
                            sov: { balance: 1n }
                        }
                    },
                    [Version.v4a]: {
                        [Token.THOR]: {
                            nft: { [1202100]: { balance: 1n} }
                        }
                    },
                    [Version.v6b]: {
                        [Token.LOKI]: {
                            nft: { [1202100]: { balance: 1n} }
                        }
                    },
                    [Version.v5a]: {
                        [Token.THOR]: {
                            ppt: { [1202100]: { balance: 1n} }
                        }
                    },
                    [Version.v6b]: {
                        [Token.LOKI]: {
                            ppt: { [1202100]: { balance: 1n} }
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
