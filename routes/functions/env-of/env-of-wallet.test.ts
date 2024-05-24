/* eslint @typescript-eslint/no-explicit-any: [off] */
import env_of_wallet from './env-of-wallet';

describe('env_of_wallet', () => {
    it('should return env-of-wallet request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(env_of_wallet(req as any)).toEqual({
            ...{
                AFT_WALLET_ACCOUNT: '0x0000000000000000000000000000000000000000',
                AFT_WALLET_TOGGLE_ROTATE: '0deg',
            },
            ...{
                OTF_WALLET: 'd-none',
                OTF_WALLET_TOGGLE: 'bi-wallet',
            },
        });
    });
});
