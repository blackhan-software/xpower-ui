/* eslint @typescript-eslint/no-explicit-any: [off] */
import './sov-integrate.scss';

import { Blockchain, ChainId } from '../../source/blockchain';
import { Alert, alert, Alerts } from '../../source/functions';
import { Token, TokenInfo } from '../../source/redux/types';

$('button.add-sov.apow').on('click', (e) => addToken(e, {
    token: Token.APOW
}));
async function addToken(
    ev: JQuery.TriggeredEvent, { token }: { token: Token }
) {
    const tgt_version = $(ev.currentTarget).data('target');
    if (await Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const info = TokenInfo(token, tgt_version);
            Alerts.hide();
            try {
                await Blockchain.addToken(info);
                alert(
                    `The ${info.symbol} token has been added to your wallet! ;)`,
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
