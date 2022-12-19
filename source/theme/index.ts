import { Token } from '../redux/types';

export type Theme = {
    XP_POWERED: string,
    XP_POWEREDi: string,
    XP_POWERED_DARK: string
    XP_POWERED_DARKi: string
};
export function theme(token: Token): Theme {
    switch (token) {
        case Token.THOR:
        case Token.aTHOR:
            return {
                XP_POWERED: '--xp-yellow',
                XP_POWEREDi: '--xp-yellow-i',
                XP_POWERED_DARK: '--xp-yellow-dark',
                XP_POWERED_DARKi: '--xp-yellow-dark-i',
            };
        case Token.LOKI:
        case Token.aLOKI:
            return {
                XP_POWERED: '--xp-lime',
                XP_POWEREDi: '--xp-lime-i',
                XP_POWERED_DARK: '--xp-lime-dark',
                XP_POWERED_DARKi: '--xp-lime-dark-i',
            };
        case Token.ODIN:
        case Token.aODIN:
            return {
                XP_POWERED: '--xp-cyan',
                XP_POWEREDi: '--xp-cyan-i',
                XP_POWERED_DARK: '--xp-cyan-dark',
                XP_POWERED_DARKi: '--xp-cyan-dark-i',
            };
        default:
            return {
                XP_POWERED: '--xp-yellow',
                XP_POWERED_DARK: '--xp-yellow-dark',
                XP_POWEREDi: '--xp-yellow-i',
                XP_POWERED_DARKi: '--xp-yellow-dark-i',
            };
    }
}
export default theme;
