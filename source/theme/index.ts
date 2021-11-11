import { TokenSymbol } from '../../source/token';

export type Theme = {
    XP_POWERED: string,
    XP_POWERED_DARK: string
};
export function theme(symbol: TokenSymbol): Theme {
    switch (symbol) {
        case TokenSymbol.CPU:
            return {
                XP_POWERED: '--xp-yellow',
                XP_POWERED_DARK: '--xp-yellow-dark'
            };
        case TokenSymbol.GPU:
            return {
                XP_POWERED: '--xp-lime',
                XP_POWERED_DARK: '--xp-lime-dark'
            };
        case TokenSymbol.ASIC:
            return {
                XP_POWERED: '--xp-cyan',
                XP_POWERED_DARK: '--xp-cyan-dark'
            };
        default:
            return {
                XP_POWERED: '--xp-yellow',
                XP_POWERED_DARK: '--xp-yellow-dark'
            };
    }
}
export default theme;
