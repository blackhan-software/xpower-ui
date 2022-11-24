/* eslint @typescript-eslint/no-explicit-any: [off] */
import './sov-integrate.scss';

import { Blockchain, ChainId } from '../../source/blockchain';
import { Alert, alert, Alerts } from '../../source/functions';
import { Token } from '../../source/redux/types';

$('button.add-sov.thor').on('click', (e) => addToken(e, {
    token: Token.THOR
}));
$('button.add-sov.loki').on('click', (e) => addToken(e, {
    token: Token.LOKI
}));
$('button.add-sov.odin').on('click', (e) => addToken(e, {
    token: Token.ODIN
}));
async function addToken(
    ev: JQuery.TriggeredEvent, { token }: { token: Token }
) {
    const tgt_version = $(ev.currentTarget).data('target');
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const address: string = $(
                `#g-${token}_SOV_${tgt_version}`).data('value');
            const symbol: string = $(
                `#g-${token}_SOV_SYMBOL_${tgt_version}`).data('value');
            const decimals: string = $(
                `#g-${token}_SOV_DECIMALS_${tgt_version}`).data('value');
            const image: string = $(
                `#g-${token}_SOV_IMAGE_${tgt_version}`).data('value');
            Alerts.hide();
            try {
                await Blockchain.addToken({
                    address: BigInt(address), symbol,
                    decimals: Number(decimals), image
                });
                alert(
                    `The ${symbol} token has been added to your wallet! ;)`,
                    Alert.success, { id: 'success', after: $(ev.currentTarget).parent('div')[0] }
                );
            } catch (ex: any) {
                if (ex.message) {
                    if (ex.data && ex.data.message) {
                        ex.message = `${ex.message} [${ex.data.message}]`;
                    }
                    alert(ex.message, Alert.warning, {
                        after: $(ev.currentTarget).parent('div')[0]
                    });
                }
                console.error(ex);
            }
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
}
