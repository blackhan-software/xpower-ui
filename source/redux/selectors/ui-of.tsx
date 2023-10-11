import { memoize } from 'proxy-memoize';
import { AppState } from '../store';
import { Ui } from '../types';

export const uiOf = memoize<
    AppState, Ui
>(s => ({
    nfts_ui: s.nfts_ui,
    ppts_ui: s.ppts_ui,
}));
export default uiOf;
