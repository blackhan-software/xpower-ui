import { Store } from '@reduxjs/toolkit';
import { onTokenSwitch } from '../redux/observers';
import { AppState } from '../redux/store';
import { Theme, theme } from '../theme';

export const ThemeService = (
    store: Store<AppState>
) => {
    onTokenSwitch(store, function syncTheme(token) {
        adapt(theme(token));
    });
    function adapt(theme: Theme): void {
        const root = document.querySelector(':root') as HTMLElement;
        if (root) {
            root.style.setProperty(
                '--xp-powered', `var(${theme.XP_POWERED})`
            );
            root.style.setProperty(
                '--xp-powered-i', `var(${theme.XP_POWEREDi})`
            );
            root.style.setProperty(
                '--xp-powered-dark', `var(${theme.XP_POWERED_DARK})`
            );
            root.style.setProperty(
                '--xp-powered-dark-i', `var(${theme.XP_POWERED_DARKi})`
            );
        }
    }
};
export default ThemeService;
