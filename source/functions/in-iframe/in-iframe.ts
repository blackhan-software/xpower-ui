export function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        console.debug(e);
        return true;
    }
}
export default inIframe;
