/* eslint @typescript-eslint/no-explicit-any: [off] */
import env_of_home from './env-of-home';

describe('env_of_cover', () => {
    it('should return env-of-cover request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        const env = env_of_home(req as any);
        expect(env.DESKTOP_MINE).not.toEqual("");
        expect(env.DESKTOP_NFTS).not.toEqual("");
        expect(env.DESKTOP_PPTS).not.toEqual("");
        expect(env.DESKTOP_SWAP).not.toEqual("");
    });
});
