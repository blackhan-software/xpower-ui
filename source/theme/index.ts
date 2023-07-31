export type Theme = {
    XP_POWERED: string,
    XP_POWEREDi: string,
    XP_POWERED_DARK: string
    XP_POWERED_DARKi: string
};
export enum ThemeColor {
    blue = 'blue',
    cyan = 'cyan',
    lime = 'lime',
    magenta = 'magenta',
    red = 'red',
    yellow = 'yellow',
    gray = 'gray',
}
export type ThemeColors
    = keyof typeof ThemeColor;
export function theme(
    color: ThemeColor
): Theme {
    return {
        XP_POWERED: `--xp-${color}`,
        XP_POWEREDi: `--xp-${color}-i`,
        XP_POWERED_DARK: `--xp-${color}-dark`,
        XP_POWERED_DARKi: `--xp-${color}-dark-i`,
    };
}
export default theme;
