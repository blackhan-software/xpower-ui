/* eslint @typescript-eslint/no-explicit-any: [off] */
import './moe-claim.scss';

import { BigNumber } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { MoeTreasuryFactory } from '../../source/contract';
import { Alert, alert, Alerts, x40 } from '../../source/functions';
import { Nft, NftLevels, Token } from '../../source/redux/types';
import { Years } from '../../source/years';

Blockchain.onConnect(function enableAllowanceButton() {
    const $claim_moe = $('.claim-moe');
    $claim_moe.prop('disabled', false);
});
$('button.claim-moe').on('click', async function claimTokens(e) {
    const $claim = $(e.target);
    if ($claim.hasClass('thor')) {
        await claim(Token.THOR, { $claim });
    }
    if ($claim.hasClass('loki')) {
        await claim(Token.LOKI, { $claim });
    }
    if ($claim.hasClass('odin')) {
        await claim(Token.ODIN, { $claim });
    }
});
async function claim(token: Token, { $claim }: {
    $claim: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const src_version = $claim.data('source');
    if (!src_version) {
        throw new Error('missing data-source');
    }
    const moe_treasury = await MoeTreasuryFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, moe_treasury.address
    );
    const ids = Nft.coreIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const src_claimable: BigNumber[] = await moe_treasury.claimableForBatch(
        x40(address), ids
    );
    console.debug(
        `[${src_version}:balances]`, src_claimable.map((b) => b.toString())
    );
    const src_zero = src_claimable.reduce((acc, b) => acc && b.isZero(), true);
    if (src_zero) {
        alert(
            `Rewards have already been claimed; you can continue now.`,
            Alert.info, { after: $claim.parent('div')[0] }
        );
        return;
    }
    Alerts.hide();
    try {
        const nz = filter(ids, src_claimable, { zero: false });
        await moe_treasury.claimForBatch(
            x40(address), nz.ids
        );
        alert(
            `Rewards have successfully been claimed; you can continue now.`,
            Alert.success, { after: $claim.parent('div')[0] }
        );
        return;
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $claim.parent('div')[0]
            });
        }
        console.error(ex);
    }
}
function filter<I, B extends BigNumber>(
    ids: Array<I>, balances: Array<B>, { zero }: { zero: boolean }
) {
    const ids_nz = [];
    const balances_nz = [];
    for (let i = 0; i < balances.length; i++) {
        if (balances[i].isZero() === zero) {
            balances_nz.push(balances[i]);
            ids_nz.push(ids[i]);
        }
    }
    return { ids: ids_nz, balances: balances_nz };
}
