import { RGB, rgbify, invert, darken, brighten } from "./color";

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
    color: ThemeColor | RGB
): Theme {
    if (typeof color === 'string') {
        return {
            XP_POWERED: `var(--xp-${color})`,
            XP_POWEREDi: `var(--xp-${color}-i)`,
            XP_POWERED_DARK: `var(--xp-${color}-dark)`,
            XP_POWERED_DARKi: `var(--xp-${color}-dark-i)`,
        };
    }
    const { r: r1, g: g1, b: b1 } = rgbify(color);
    const { r: r2, g: g2, b: b2 } = invert(color);
    const { r: r3, g: g3, b: b3 } = darken(color);
    const { r: r4, g: g4, b: b4 } = brighten(color);
    return {
        XP_POWERED: `rgba(${r1},${g1},${b1},1)`,
        XP_POWEREDi: `rgba(${r2},${g2},${b2},1)`,
        XP_POWERED_DARK: `rgba(${r3},${g3},${b3},1)`,
        XP_POWERED_DARKi: `rgba(${r4},${g4},${b4},1)`,
    };
}
export default theme;
