/* eslint @typescript-eslint/no-explicit-any: [off] */
import env_of_token from './env-of-token';

describe('env_of_token', () => {
    it('should return env-of-token request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(env_of_token(req as any)).toEqual({
            ...{
                POWER: 'XPOWER',
                power: 'xpower',
            }, ...{
                TOKEN: 'XPOW',
                token: 'xpow',
                Token: 'XPow',
            }, ...{
                aTOKEN: 'APOW',
                atoken: 'apow',
                aToken: 'APow',
            }, ...{
                xTOKEN: 'XPOW',
                xtoken: 'xpow',
                xToken: 'XPow',
            }
        });
    });
});
