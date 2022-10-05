import { Store } from '../../source/redux/store';
import { Theme, theme } from '../../source/theme';

Store.onTokenSwitch(function syncTheme(token) {
    adapt(theme(token));
});
function adapt(theme: Theme): void {
    const root = document.querySelector(':root') as HTMLElement;
    if (root) {
        root.style.setProperty('--xp-powered', `var(
            ${theme.XP_POWERED}
        )`);
        root.style.setProperty('--xp-powered-dark', `var(
            ${theme.XP_POWERED_DARK}
        )`);
    }
}
