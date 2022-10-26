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
                XP_POWERED: "--xp-yellow",
                XP_POWERED_DARK: "--xp-yellow-dark",
            }, ...{
                AMOUNT_1: "1",
                AMOUNT_2: "2",
                AMOUNT_3: "3",
                AMOUNT_4: "4",
                AMOUNT_5: "5",
                AMOUNT_6: "6",
                AMOUNT_7: "7",
                AMOUNT_8: "8",
                AMOUNT_9: "9",
                AMOUNT_10: "10",
                AMOUNT_11: "11",
                AMOUNT_12: "12",
                AMOUNT_13: "13",
                AMOUNT_14: "14",
                AMOUNT_15: "15",
                AMOUNT_16: "16",
                AMOUNT_17: "17",
                AMOUNT_18: "18",
                AMOUNT_19: "19",
                AMOUNT_20: "20",
                AMOUNT_21: "21",
                AMOUNT_22: "22",
                AMOUNT_23: "23",
                AMOUNT_24: "24",
                AMOUNT_25: "25",
                AMOUNT_26: "26",
                AMOUNT_27: "27",
                AMOUNT_28: "28",
                AMOUNT_29: "29",
                AMOUNT_30: "30",
                AMOUNT_31: "31",
                AMOUNT_32: "32",
                AMOUNT_33: "33",
                AMOUNT_34: "34",
                AMOUNT_35: "35",
                AMOUNT_36: "36",
                AMOUNT_37: "37",
                AMOUNT_38: "38",
                AMOUNT_39: "39",
                AMOUNT_40: "40",
                AMOUNT_41: "41",
                AMOUNT_42: "42",
                AMOUNT_43: "43",
                AMOUNT_44: "44",
                AMOUNT_45: "45",
                AMOUNT_46: "46",
                AMOUNT_47: "47",
                AMOUNT_48: "48",
                AMOUNT_49: "49",
                AMOUNT_50: "50",
                AMOUNT_51: "51",
                AMOUNT_52: "52",
                AMOUNT_53: "53",
                AMOUNT_54: "54",
                AMOUNT_55: "55",
                AMOUNT_56: "56",
                AMOUNT_57: "57",
                AMOUNT_58: "58",
                AMOUNT_59: "59",
                AMOUNT_60: "60",
                AMOUNT_61: "61",
                AMOUNT_62: "62",
                AMOUNT_63: "63",
                AMOUNT_64: "64",
            }, ...{
                UI_MINING_SPEED: 50,
            }
        });
    });
});
