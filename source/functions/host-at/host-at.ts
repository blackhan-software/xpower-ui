export function hostAt(
    prefix = /^www/i
) {
    return location.host.match(prefix);
}
export default hostAt;
