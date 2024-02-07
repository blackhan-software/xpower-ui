import { ROParams } from "../params";
import { RGB, rgbify, invert, darken, brighten } from "./color";
import Prefixed from "./prefixed";

export type Theme = {
    XP_POWERED: string,
    XP_POWEREDi: string,
    XP_POWERED_DARK: string
    XP_POWERED_DARKi: string
} & {
    XP_ACCENTUATED: string,
    XP_ACCENTUATEDi: string,
    XP_ACCENTUATED_DARK: string
    XP_ACCENTUATED_DARKi: string
};
export enum ThemeColor {
    blue = 'blue',
    cyan = 'cyan',
    lime = 'lime',
    magenta = 'magenta',
    red = 'red',
    yellow = 'yellow',
    gray = 'gray',
    white = 'white',
}
export type ThemeColors
    = keyof typeof ThemeColor;
export function theme(
    color: ThemeColor | RGB = ROParams.color,
    color_alt: ThemeColor | RGB = ROParams.colorAlt
): Theme {
    let xp_powered: Prefixed<Theme, 'XP_POWERED'>;
    if (typeof color === 'string') {
        xp_powered = {
            XP_POWERED: `var(--xp-${color})`,
            XP_POWEREDi: `var(--xp-${color}-i)`,
            XP_POWERED_DARK: `var(--xp-${color}-dark)`,
            XP_POWERED_DARKi: `var(--xp-${color}-dark-i)`,
        };
    } else {
        const { r: r1, g: g1, b: b1 } = rgbify(color);
        const { r: r2, g: g2, b: b2 } = invert(color);
        const { r: r3, g: g3, b: b3 } = darken(color);
        const { r: r4, g: g4, b: b4 } = brighten(color);
        xp_powered = {
            XP_POWERED: `rgba(${r1},${g1},${b1},1)`,
            XP_POWEREDi: `rgba(${r2},${g2},${b2},1)`,
            XP_POWERED_DARK: `rgba(${r3},${g3},${b3},1)`,
            XP_POWERED_DARKi: `rgba(${r4},${g4},${b4},1)`,
        };
    }
    let xp_accentuated: Prefixed<Theme, 'XP_ACCENTUATED'>;
    if (typeof color_alt === 'string') {
        xp_accentuated = {
            XP_ACCENTUATED: `var(--xp-${color_alt})`,
            XP_ACCENTUATEDi: `var(--xp-${color_alt}-i)`,
            XP_ACCENTUATED_DARK: `var(--xp-${color_alt}-dark)`,
            XP_ACCENTUATED_DARKi: `var(--xp-${color_alt}-dark-i)`,
        };
    } else {
        const { r: R1, g: G1, b: B1 } = rgbify(color_alt);
        const { r: R2, g: G2, b: B2 } = invert(color_alt);
        const { r: R3, g: G3, b: B3 } = darken(color_alt);
        const { r: R4, g: G4, b: B4 } = brighten(color_alt);
        xp_accentuated = {
            XP_ACCENTUATED: `rgba(${R1},${G1},${B1},1)`,
            XP_ACCENTUATEDi: `rgba(${R2},${G2},${B2},1)`,
            XP_ACCENTUATED_DARK: `rgba(${R3},${G3},${B3},1)`,
            XP_ACCENTUATED_DARKi: `rgba(${R4},${G4},${B4},1)`,
        };
    }
    return { ...xp_powered, ...xp_accentuated };
}
export default theme;
