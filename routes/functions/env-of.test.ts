/* eslint @typescript-eslint/no-explicit-any: [off] */
import env_of from './env-of';

describe('env_of', () => {
    it('should return env-of request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(env_of(req as any)).toEqual({
            ...{
                HEADER_ABOUT: '',
                HEADER_HOME: '',
                HEADER_NFTS: '',
                HEADER_STAKING: '',
            }, ...{
                OTF_WALLET: 'd-none',
                OTF_WALLET_TOGGLE: 'bi-wallet',
            }, ...{
                SELECT0R_HELA: '',
                SELECT0R_LOKI: '',
                SELECT0R_ODIN: '',
                SELECT0R_THOR: 'active',
            }, ...{
                TOKEN: 'THOR',
                token: 'thor',
                Token: 'Thor',
            }, ...{
                aTOKEN: 'aTHOR',
                atoken: 'athor',
                aToken: 'aThor',
            }, ...{
                xTOKEN: 'THOR',
                xtoken: 'thor',
                xToken: 'Thor',
            }, ...{
                XP_POWERED: '--xp-yellow',
                XP_POWERED_DARK: '--xp-yellow-dark',
                XP_POWEREDi: '--xp-yellow-i',
                XP_POWERED_DARKi: '--xp-yellow-dark-i',
            }
        });
    });
});
