/* eslint @typescript-eslint/no-explicit-any: [off] */
import './moe-integrate.scss';

import { Alerts, Alert, alert } from '../../source/functions';
import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Token } from '../../source/redux/types';

$('button.add-xpow.thor').on('click', (e) => addToken(e, {
    token: Token.THOR
}));
$('button.add-xpow.loki').on('click', (e) => addToken(e, {
    token: Token.LOKI
}));
$('button.add-xpow.odin').on('click', (e) => addToken(e, {
    token: Token.ODIN
}));
async function addToken(
    ev: JQuery.TriggeredEvent, { token }: { token: Token }
) {
    const tgt_version = $(ev.target).data('target');
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const address: string = $(
                `#g-${token}_MOE_${tgt_version}`).data('value');
            const symbol: string = $(
                `#g-${token}_SYMBOL_${tgt_version}`).data('value');
            const decimals: string = $(
                `#g-${token}_DECIMALS_${tgt_version}`).data('value');
            const image: string = $(
                `#g-${token}_IMAGE_${tgt_version}`).data('value');
            Alerts.hide();
            try {
                await Blockchain.addToken({
                    address: BigInt(address), symbol,
                    decimals: Number(decimals), image
                });
                alert(
                    `The ${symbol} token has successfully been added to your wallet! ;)`,
                    Alert.success, { id: 'success', after: $(ev.target).parent('div')[0] }
                );
            } catch (ex: any) {
                if (ex.message) {
                    if (ex.data && ex.data.message) {
                        ex.message = `${ex.message} [${ex.data.message}]`;
                    }
                    alert(ex.message, Alert.warning, {
                        after: $(ev.target).parent('div')[0]
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
