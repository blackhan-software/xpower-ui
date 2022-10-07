import { otfWalletOf } from './otf-wallet-of';

describe('otf-wallet-of', () => {
    it('should return otf-wallet', () => {
        const otf_wallet = {
            address: null, amount: null,
            processing: null, toggled: null
        };
        const otf_wallet_of = otfWalletOf({ otf_wallet });
        expect(otf_wallet_of).toEqual(otf_wallet);
    });
});
