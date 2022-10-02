import { setNftsUi } from '../actions';
import { nftsUiReducer, nftsUiState } from './nfts-ui-reducer';

describe('Store w/nfts-ui-reducer', () => {
    it('should set nfts-ui [toggled==true]', () => {
        const state_0 = nftsUiState();
        const state_1 = nftsUiReducer(state_0, setNftsUi({
            toggled: true
        }));
        expect(state_1.toggled).toEqual(true);
    });
    it('should set nfts-ui [toggled==false]', () => {
        const state_0 = nftsUiState();
        const state_1 = nftsUiReducer(state_0, setNftsUi({
            toggled: false
        }));
        expect(state_1.toggled).toEqual(false);
    });
});
