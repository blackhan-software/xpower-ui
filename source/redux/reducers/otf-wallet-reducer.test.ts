import { setOtfWalletAddress, setOtfWalletAmount, setOtfWalletProcessing } from '../actions';
import { otfWalletReducer, otfWalletState } from './otf-wallet-reducer';

describe('Store w/wallet-ui-reducer', () => {
    it('should set-otf-wallet [amount]', () => {
        const state_0 = otfWalletState();
        const state_1 = otfWalletReducer(
            state_0, setOtfWalletAmount({
                amount: 1n
            })
        );
        expect(state_1).toMatchObject({
            ...otfWalletState(), amount: 1n
        });
    });
    it('should set-otf-wallet [address]', () => {
        const state_0 = otfWalletState();
        const state_1 = otfWalletReducer(
            state_0, setOtfWalletAddress({
                address: 0n
            })
        );
        expect(state_1).toMatchObject({
            ...otfWalletState(), address: 0n
        });
    });
    it('should set-otf-wallet [processing]', () => {
        const state_0 = otfWalletState();
        const state_1 = otfWalletReducer(
            state_0, setOtfWalletProcessing({
                processing: true
            })
        );
        expect(state_1).toMatchObject({
            ...otfWalletState(), processing: true
        });
    });
});
