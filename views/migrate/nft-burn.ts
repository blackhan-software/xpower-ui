/* eslint @typescript-eslint/no-explicit-any: [off] */
import './nft-burn.scss';

import { Transaction } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { Alert, alert, Alerts, x40 } from '../../source/functions';
import { Account, Balance, Nft, NftLevels, Token } from '../../source/redux/types';
import { Version } from '../../source/types';
import { NftWallet } from '../../source/wallet';
import { Years } from '../../source/years';

Blockchain.onConnect(function enableBurnButton() {
    const $burn_nft = $('button.burn-empty-nft').filter((i, el) => {
        const source = new RegExp($(el).data('source'));
        return 'v3a'.match(source) !== null;
    });
    $burn_nft.prop('disabled', false);
    $burn_nft.parents('form').show();
    $burn_nft.parents('form').prev('h2').show();
});
$('button.burn-empty-nft').on('click', async function burnEmpty(e) {
    const $burn = $(e.currentTarget);
    if ($burn.hasClass('xpow')) {
        await burn(Token.XPOW, { $burn });
    }
});
async function burn(token: Token, { $burn }: {
    $burn: JQuery<HTMLElement>
}) {
    const { account, src_version } = await context({
        $el: $burn
    });
    const { nft_source } = await contracts({
        account, token, src_version
    });
    //
    // Check balances:
    //
    const ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels()),
        token: Nft.token(token)
    });
    const accounts = ids.map(() => {
        return x40(account);
    });
    const src_balances: Balance[] = await nft_source.get.then(
        (c) => c.balanceOfBatch(accounts, Nft.realIds(ids, {
            version: src_version
        }))
    );
    console.debug(
        `[${src_version}:balances]`, src_balances.map((b) => b.toString())
    );
    const zz = filter(ids, src_balances, {
        zero: true
    });
    //
    // Burn tokens:
    //
    let tx: Transaction | undefined;
    const reset = $burn.ing();
    Alerts.hide();
    try {
        nft_source.onTransferBatch((
            operator, from, to, ids, values, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Your old empty NFTs have been burned! ;)`,
                Alert.success, { id: 'success', after: $burn.parent('div')[0] }
            );
            reset();
        });
        tx = await nft_source.get.then((c) => c.burnBatch(
            x40(account), Nft.realIds(zz.ids, { version: src_version }), zz.balances
        ));
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $burn.parent('div')[0]
            });
        }
        console.error(ex);
        reset();
    }
}
function filter<I, B extends bigint>(
    ids: Array<I>, balances: Array<B>, { zero }: { zero: boolean }
) {
    const ids_nz = [];
    const balances_nz = [];
    for (let i = 0; i < balances.length; i++) {
        if (!balances[i] === zero) {
            balances_nz.push(balances[i]);
            ids_nz.push(ids[i]);
        }
    }
    return { ids: ids_nz, balances: balances_nz };
}
async function context({ $el: $approve }: {
    $el: JQuery<HTMLElement>
}) {
    const account = await Blockchain.account;
    if (!account) {
        throw new Error('missing account');
    }
    const src_version = $approve.data('source');
    if (!src_version) {
        throw new Error('missing data-source');
    }
    return { account, src_version };
}
async function contracts({
    account, token, src_version
}: {
    account: Account, token: Token, src_version: Version
}) {
    const nft_source = new NftWallet(
        account, token, src_version
    );
    console.debug(
        `[${src_version}:contract]`, await nft_source.address
    );
    return {
        nft_source,
    };
}
