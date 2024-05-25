export function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        console.assert(e);
        return true;
    }
}
export default inIframe;
