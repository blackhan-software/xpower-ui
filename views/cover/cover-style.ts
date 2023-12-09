export function style(
    name: string
) {
    const styles = getComputedStyle(document.body);
    const varcss = name.match(/^var\((?<key>[^)]+)\)/);
    if (varcss && varcss.groups) {
        const key = varcss.groups.key;
        return styles.getPropertyValue(key).trim();
    }
    const rgbcss = name.match(/^rgba?\((?<value>[^)]+)\)/);
    if (rgbcss && rgbcss.groups) {
        return name;
    }
    return styles.getPropertyValue(name).trim();
}
export default style;
