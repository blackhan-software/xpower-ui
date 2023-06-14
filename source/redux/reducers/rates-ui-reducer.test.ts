import { setRatesUi, setRatesUiRefresher } from '../actions';
import { NftToken } from '../types';
import { ratesUiReducer, ratesUiState } from './rates-ui-reducer';

describe('Store w/rates-ui-reducer', () => {
    it('should set rates-ui [*]', () => {
        const state_0 = ratesUiState();
        const state_1 = ratesUiReducer(state_0, setRatesUi({
            refresher: { [NftToken.THOR]: { status: null } }
        }));
        expect(state_1.refresher[NftToken.THOR]).toEqual({
            status: null
        });
    });
    it('should set rates-ui [refresher]', () => {
        const state_0 = ratesUiState();
        const state_1 = ratesUiReducer(state_0, setRatesUiRefresher({
            refresher: { [NftToken.THOR]: { status: null } }
        }));
        expect(state_1.refresher[NftToken.THOR]).toEqual({
            status: null
        });
    });
});
