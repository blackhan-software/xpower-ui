import { AppState } from '../store';
import { Refresh } from '../types';
let old_refresh: Refresh;

export function refreshed(
    { refresh }: Pick<AppState, 'refresh'>
): boolean {
    if (old_refresh?.date !== refresh.date) {
        old_refresh = refresh;
        return true;
    }
    return false;
}
export default refreshed;
