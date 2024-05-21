import { pageReducer } from './page-reducer';
import { switchPage } from '../actions';
import { Page } from '../types';

describe('Store w/page-reducer', () => {
    it('should switch to mine page', () => {
        const state_0 = Page.Mine;
        const state_1 = pageReducer(state_0, switchPage(Page.Mine));
        expect(state_1).toEqual(Page.Mine);
    });
    it('should switch to nfts page', () => {
        const state_0 = Page.Mine;
        const state_1 = pageReducer(state_0, switchPage(Page.Nfts));
        expect(state_1).toEqual(Page.Nfts);
    });
    it('should switch to staking page', () => {
        const state_0 = Page.Nfts;
        const state_1 = pageReducer(state_0, switchPage(Page.Ppts));
        expect(state_1).toEqual(Page.Ppts);
    });
    it('should switch to about page', () => {
        const state_0 = Page.Ppts;
        const state_1 = pageReducer(state_0, switchPage(Page.About));
        expect(state_1).toEqual(Page.About);
    });
});
