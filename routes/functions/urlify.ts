export function urlify(url: string) {
    try {
        return new URL(url);
    } catch (e) {
        console.debug(e);
        return null;
    }
}
export default urlify;
