import { Theme, theme } from '../../source/theme';
import { Token } from '../../source/token';
import { App } from '../../source/app/app';

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        const symbol = Token.symbol(App.me.params.get('token'));
        adapt(theme(symbol));
    }
};
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
