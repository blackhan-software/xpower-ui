import { AppState } from '../store';
import { uiOf } from './ui-of';

describe('wallet-of', () => {
    it('should return wallet', () => {
        const nfts_ui = {};
        const ppts_ui = {};
        const ui = {
            nfts_ui, ppts_ui
        };
        const ui_of = uiOf(ui as AppState);
        expect(ui_of).toEqual(ui);
    });
});
