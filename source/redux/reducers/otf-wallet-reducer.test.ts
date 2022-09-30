import { state, otfWalletReducer } from './otf-wallet-reducer';
import { setOtfWallet } from '../actions';

describe('Store w/wallet-ui-reducer', () => {
    it('should set-wallet-ui [otf.amount]', () => {
        const state_0 = state();
        const state_1 = otfWalletReducer(state_0, setOtfWallet({
            amount: 1n
        }));
        expect(state_1).toMatchObject({
            ...state(), amount: 1n
        });
    });
    it('should set-wallet-ui [otf.address]', () => {
        const state_0 = state();
        const state_1 = otfWalletReducer(state_0, setOtfWallet({
            address: 0n
        }));
        expect(state_1).toMatchObject({
            ...state(), address: 0n
        });
    });
    it('should set-wallet-ui [processing]', () => {
        const state_0 = state();
        const state_1 = otfWalletReducer(state_0, setOtfWallet({
            processing: true
        }));
        expect(state_1).toMatchObject({
            ...state(), processing: true
        });
    });
});
