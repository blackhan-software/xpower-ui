/* eslint @typescript-eslint/no-explicit-any: [off] */
import { env_of_home } from './env-of-home';

describe('env_of_home', () => {
    it('should return amounts_for request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(env_of_home(req as any)).toEqual({
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
                AMOUNT_1: "1",
                AMOUNT_2: "3",
                AMOUNT_3: "7",
                AMOUNT_4: "15",
                AMOUNT_5: "31",
                AMOUNT_6: "63",
                AMOUNT_7: "127",
                AMOUNT_8: "255",
                AMOUNT_9: "511",
                AMOUNT_10: "1.023K",
                AMOUNT_11: "2.047K",
                AMOUNT_12: "4.095K",
                AMOUNT_13: "8.191K",
                AMOUNT_14: "16.383K",
                AMOUNT_15: "32.767K",
                AMOUNT_16: "65.535K",
                AMOUNT_17: "131.071K",
                AMOUNT_18: "262.143K",
                AMOUNT_19: "524.287K",
                AMOUNT_20: "1.049M",
                AMOUNT_21: "2.097M",
                AMOUNT_22: "4.194M",
                AMOUNT_23: "8.389M",
                AMOUNT_24: "16.777M",
                AMOUNT_25: "33.554M",
                AMOUNT_26: "67.109M",
                AMOUNT_27: "134.218M",
                AMOUNT_28: "268.435M",
                AMOUNT_29: "536.871M",
                AMOUNT_30: "1.074G",
                AMOUNT_31: "2.147G",
                AMOUNT_32: "4.295G",
                AMOUNT_33: "8.59G",
                AMOUNT_34: "17.18G",
                AMOUNT_35: "34.36G",
                AMOUNT_36: "68.719G",
                AMOUNT_37: "137.439G",
                AMOUNT_38: "274.878G",
                AMOUNT_39: "549.756G",
                AMOUNT_40: "1.1T",
                AMOUNT_41: "2.199T",
                AMOUNT_42: "4.398T",
                AMOUNT_43: "8.796T",
                AMOUNT_44: "17.592T",
                AMOUNT_45: "35.184T",
                AMOUNT_46: "70.369T",
                AMOUNT_47: "140.737T",
                AMOUNT_48: "281.475T",
                AMOUNT_49: "562.95T",
                AMOUNT_50: "1.126P",
                AMOUNT_51: "2.252P",
                AMOUNT_52: "4.504P",
                AMOUNT_53: "9.007P",
                AMOUNT_54: "18.014P",
                AMOUNT_55: "36.029P",
                AMOUNT_56: "72.058P",
                AMOUNT_57: "144.115P",
                AMOUNT_58: "288.23P",
                AMOUNT_59: "576.461P",
                AMOUNT_60: "1.153E",
                AMOUNT_61: "2.306E",
                AMOUNT_62: "4.612E",
                AMOUNT_63: "9.223E",
                AMOUNT_64: "18.447E",
            }, ...{
                LHS_LEVEL: "6",
                LHX_LEVEL: "7",
                RHS_LEVEL: "6",
                RHX_LEVEL: "7",
            }, ...{
                UI_MINING_SPEED: 50,
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
