import { Refresh } from '../types';
let old_refresh: Refresh;

export function refreshed(
    refresh: Refresh
): boolean {
    if (old_refresh?.date !== refresh.date) {
        old_refresh = refresh;
        return true;
    }
    return false;
}
export default refreshed;
