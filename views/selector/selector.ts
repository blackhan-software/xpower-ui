import { Tokenizer } from '../../source/token';
import { App } from '../../source/app';
import './selector.scss'

$(window).on('load', async function activateSelector() {
    const suffix = Tokenizer.suffix(App.token);
    $(`.selector-${suffix}`).addClass('active');
});
