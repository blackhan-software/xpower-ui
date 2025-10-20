/* eslint @typescript-eslint/no-explicit-any: [off] */
import env_of_swap from './env-of-swap';

describe('env_of_swap', () => {
    it('should return env-of-swap request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(env_of_swap(req as any)).toEqual({
            ACTIVE_VELORA: 'active',
            ACTIVE_UNISWAP: '',
            COLOR_VELORA: 'var(--xp-dark)',
            COLOR_UNISWAP: 'var(--xp-powered)',
        });
    });
});
