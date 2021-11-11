import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Token } from '../../source/token';
import { App } from '../../source/app/app';

$(window).on('load', function setContractAddress() {
    const token = Token.symbolAlt(App.me.params.get('token'));
    const address = $(`#g-xpower-address-${token}`).data('value');
    const $link = $('a.smart-contract');
    $link.attr('href', `https://snowtrace.io/address/${address}`);
});
$('a.add-token').on('click', async function addToken() {
    if (Blockchain.me.isInstalled()) {
        if (await Blockchain.me.isAvalanche()) {
            const token = Token.symbolAlt(App.me.params.get('token'));
            const address = $(`#g-xpower-address-${token}`).data('value');
            const symbol = $(`#g-xpower-symbol-${token}`).data('value');
            const decimals = $(`#g-xpower-decimals-${token}`).data('value');
            const image = $(`#g-xpower-image-${token}`).data('value');
            await Blockchain.me.addToken({
                address, symbol, decimals, image
            });
        } else {
            Blockchain.me.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
