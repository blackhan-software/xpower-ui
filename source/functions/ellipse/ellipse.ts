export function ellipse(s: string, lhs = 5, rhs = -3): string {
    const px = s.slice(0, lhs);
    const sx = s.slice(rhs);
    return `${px}…${sx}`;
}
export default ellipse;

