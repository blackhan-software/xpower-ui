import { setOtfWalletAccount, setOtfWalletAmount, setOtfWalletProcessing, setOtfWalletToggle } from '../actions';
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
    it('should set-otf-wallet [account]', () => {
        const state_0 = otfWalletState();
        const state_1 = otfWalletReducer(
            state_0, setOtfWalletAccount({
                account: 0n
            })
        );
        expect(state_1).toMatchObject({
            ...otfWalletState(), account: 0n
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
    it('should set-otf-wallet [toggled]', () => {
        const state_0 = otfWalletState();
        const state_1 = otfWalletReducer(
            state_0, setOtfWalletToggle({
                toggled: true
            })
        );
        expect(state_1).toMatchObject({
            ...otfWalletState(), toggled: true
        });
    });
});
