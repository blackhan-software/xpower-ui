import { Token } from '../redux/types';

export type Theme = {
    XP_POWERED: string,
    XP_POWEREDi: string,
    XP_POWERED_DARK: string
    XP_POWERED_DARKi: string
};
export function theme(token: Token): Theme {
    switch (token) {
        case Token.XPOW:
        case Token.APOW:
        default:
            return {
                XP_POWERED: '--xp-lime',
                XP_POWEREDi: '--xp-lime-i',
                XP_POWERED_DARK: '--xp-lime-dark',
                XP_POWERED_DARKi: '--xp-lime-dark-i',
            };
    }
}
export default theme;
