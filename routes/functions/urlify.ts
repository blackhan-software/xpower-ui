export function urlify(url: string) {
    try {
        return new URL(url);
    } catch (_) {
        return null;
    }
}
export default urlify;
