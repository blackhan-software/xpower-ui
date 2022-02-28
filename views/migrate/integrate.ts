import './integrate.scss';

import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

$('button.add-xpow.cpu').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.CPU);
            const address = $(`#g-xpower-address-${token}-v3`).data('value');
            const symbol = $(`#g-xpower-symbol-${token}-v3`).data('value');
            const decimals = $(`#g-xpower-decimals-${token}-v3`).data('value');
            const image = $(`#g-xpower-image-${token}-v3`).data('value');
            await Blockchain.addToken({
                address, symbol, decimals, image
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
$('button.add-xpow.gpu').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.GPU);
            const address = $(`#g-xpower-address-${token}-v3`).data('value');
            const symbol = $(`#g-xpower-symbol-${token}-v3`).data('value');
            const decimals = $(`#g-xpower-decimals-${token}-v3`).data('value');
            const image = $(`#g-xpower-image-${token}-v3`).data('value');
            await Blockchain.addToken({
                address, symbol, decimals, image
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
$('button.add-xpow.asic').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Tokenizer.symbolAlt(Token.ASIC);
            const address = $(`#g-xpower-address-${token}-v3`).data('value');
            const symbol = $(`#g-xpower-symbol-${token}-v3`).data('value');
            const decimals = $(`#g-xpower-decimals-${token}-v3`).data('value');
            const image = $(`#g-xpower-image-${token}-v3`).data('value');
            await Blockchain.addToken({
                address, symbol, decimals, image
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
