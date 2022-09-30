import { otf, walletUiReducer } from './wallet-ui-reducer';
import { setWalletUi } from '../actions';

describe('Store w/wallet-ui-reducer', () => {
    it('should set-wallet-ui [otf.amount]', () => {
        const state_0 = { otf: otf() };
        const state_1 = walletUiReducer(state_0, setWalletUi({
            otf: { amount: 1n }
        }));
        expect(state_1).toMatchObject({
            otf: { ...otf(), amount: 1n }
        });
    });
    it('should set-wallet-ui [otf.address]', () => {
        const state_0 = { otf: otf() };
        const state_1 = walletUiReducer(state_0, setWalletUi({
            otf: { address: 0n }
        }));
        expect(state_1).toMatchObject({
            otf: { ...otf(), address: 0n }
        });
    });
    it('should set-wallet-ui [otf.processing]', () => {
        const state_0 = { otf: otf() };
        const state_1 = walletUiReducer(state_0, setWalletUi({
            otf: { processing: true }
        }));
        expect(state_1).toMatchObject({
            otf: { ...otf(), processing: true }
        });
    });
});
