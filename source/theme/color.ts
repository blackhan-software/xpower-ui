export const RGB1_REGEX = /^(?<r>[0-9a-f]{1})(?<g>[0-9a-f]{1})(?<b>[0-9a-f]{1})$/i;
export const RGB2_REGEX = /^(?<r>[0-9a-f]{2})(?<g>[0-9a-f]{2})(?<b>[0-9a-f]{2})$/i;
export type RGB = {
    r: string; g: string; b: string;
};
export function rgbify({ r, g, b }: RGB) {
    return {
        r: parseInt(r.repeat(3 - r.length), 16),
        g: parseInt(g.repeat(3 - g.length), 16),
        b: parseInt(b.repeat(3 - b.length), 16),
    };
}
export function invert(rgb: RGB) {
    const { r, g, b } = rgbify(rgb);
    return {
        r: 255 - r,
        g: 255 - g,
        b: 255 - b,
    };
}
export function darken(rgb: RGB, percent = 0.5) {
    const { r, g, b } = rgbify(rgb);
    return {
        r: Math.floor(r * percent),
        g: Math.floor(g * percent),
        b: Math.floor(b * percent),
    };
}
export function brighten(rgb: RGB, percent = 0.5) {
    const { r, g, b } = rgbify(rgb);
    return {
        r: 255 - Math.floor(r * percent),
        g: 255 - Math.floor(g * percent),
        b: 255 - Math.floor(b * percent),
    };
}
