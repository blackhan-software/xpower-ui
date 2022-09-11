export function mobile() {
    return global?.navigator?.userAgent?.match(/mobi/i);
}
export default mobile;
