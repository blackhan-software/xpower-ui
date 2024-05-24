/* eslint @typescript-eslint/no-explicit-any: [off] */
import env_of_footer from './env-of-footer';

describe('env_of_footer', () => {
    it('should return env-of-footer request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(env_of_footer(req as any)).toEqual({
            FOOTER_SWAP: '',
        });
    });
});
