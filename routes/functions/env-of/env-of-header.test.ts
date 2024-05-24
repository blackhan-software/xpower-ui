/* eslint @typescript-eslint/no-explicit-any: [off] */
import env_of_header from './env-of-header';

describe('env_of_header', () => {
    it('should return env-of-header request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(env_of_header(req as any)).toEqual({
            HEADER_ABOUT: '',
            HEADER_HOME: '',
            HEADER_MINE: '',
            HEADER_NFTS: '',
            HEADER_PPTS: '',
            HEADER_SWAP: '',
        });
    });
});
