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
                HEADER_PPTS: '',
                HEADER_SWAP: '',
            }, ...{
                FOOTER_SWAP: '',
            }, ...{
                AFT_WALLET_ACCOUNT: '0x0000000000000000000000000000000000000000',
                OTF_WALLET: 'd-none',
                OTF_WALLET_TOGGLE: 'bi-wallet',
            }, ...{
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
            }, ...{
                XP_POWERED: 'var(--xp-white)',
                XP_POWERED_DARK: 'var(--xp-white-dark)',
                XP_POWEREDi: 'var(--xp-white-i)',
                XP_POWERED_DARKi: 'var(--xp-white-dark-i)',
            }, ...{
                XP_ACCENTUATED: 'var(--xp-magenta)',
                XP_ACCENTUATED_DARK: 'var(--xp-magenta-dark)',
                XP_ACCENTUATEDi: 'var(--xp-magenta-i)',
                XP_ACCENTUATED_DARKi: 'var(--xp-magenta-dark-i)',
            }, ...{
                COVER_IMAGE: '',
            }, ...{
                NFT_UNIT_DISPLAY: 'none',
                NFT_KILO_DISPLAY: 'none',
                NFT_MEGA_DISPLAY: 'none',
                NFT_GIGA_DISPLAY: 'none',
                NFT_TERA_DISPLAY: 'none',
                NFT_PETA_DISPLAY: 'none',
                NFT_EXA_DISPLAY: 'none',
                NFT_ZETTA_DISPLAY: 'none',
                NFT_YOTTA_DISPLAY: 'none',
            }, ...{
                NFT_UNIT_CHEVRON: 'down',
                NFT_KILO_CHEVRON: 'down',
                NFT_MEGA_CHEVRON: 'down',
                NFT_GIGA_CHEVRON: 'down',
                NFT_TERA_CHEVRON: 'down',
                NFT_PETA_CHEVRON: 'down',
                NFT_EXA_CHEVRON: 'down',
                NFT_ZETTA_CHEVRON: 'down',
                NFT_YOTTA_CHEVRON: 'down',
            }, ...{
                ACTIVE_PARASWAP: 'active',
                ACTIVE_UNISWAP: '',
                COLOR_PARASWAP: 'var(--xp-dark)',
                COLOR_UNISWAP: 'var(--xp-powered)',
            },
        });
    });
});
