/* eslint @typescript-eslint/no-explicit-any: [off] */
import env_of_theme from './env-of-theme';

describe('env_of_theme', () => {
    it('should return env-of-theme request', () => {
        const req = {
            headers: { 'x-forwarded-host': 'localhost:3000' },
            protocol: 'http'
        };
        expect(env_of_theme(req as any)).toEqual({
            ...{
                XP_POWERED: 'var(--xp-white)',
                XP_POWERED_DARK: 'var(--xp-white-dark)',
                XP_POWEREDi: 'var(--xp-white-i)',
                XP_POWERED_DARKi: 'var(--xp-white-dark-i)',
            }, ...{
                XP_ACCENTUATED: 'var(--xp-magenta)',
                XP_ACCENTUATED_DARK: 'var(--xp-magenta-dark)',
                XP_ACCENTUATEDi: 'var(--xp-magenta-i)',
                XP_ACCENTUATED_DARKi: 'var(--xp-magenta-dark-i)',
            },
        });
    });
});
