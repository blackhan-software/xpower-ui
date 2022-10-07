import { AppState } from '../store';
import { Page } from '../types';

export function pageOf(
    { page }: Pick<AppState, 'page'>
): Page {
    return page;
}
export default pageOf;
