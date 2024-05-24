/* eslint @typescript-eslint/no-explicit-any: [off] */
import env_of_cover from './env-of-cover';

describe('env_of_cover', () => {
    it('should return env-of-cover request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(env_of_cover(req as any)).toEqual({
            COVER_IMAGE: '',
        });
    });
});
