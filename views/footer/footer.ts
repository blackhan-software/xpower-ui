import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';

$('a.add-token').on('click', async function addToken() {
    if (Blockchain.me.isInstalled()) {
        if (await Blockchain.me.isAvalanche()) {
            const address = $('#g-xpower-address').data('value');
            const symbol = $('#g-xpower-symbol').data('value');
            const decimals = $('#g-xpower-decimals').data('value');
            const image = $('#g-xpower-image').data('value');
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
