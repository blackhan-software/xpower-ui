/* eslint @typescript-eslint/no-explicit-any: [off] */
import './any-claim.scss';

import { BigNumber, Contract, Transaction } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { MoeTreasuryFactory, OnClaimBatch } from '../../source/contract';
import { Alert, alert, Alerts, x40 } from '../../source/functions';
import { Nft, NftLevels, Token } from '../../source/redux/types';
import { Version } from '../../source/types';
import { Years } from '../../source/years';

Blockchain.onConnect(function enableAllowanceButton() {
    const $claim_any = $('.claim-any').filter((i, el) => {
        const source = new RegExp($(el).data('source'));
        return 'v2a|v3a|v3b'.match(source) === null;
    });
    $claim_any.prop('disabled', false);
});
$('button.claim-any').on('click', async function claimTokens(e) {
    const $claim = $(e.currentTarget);
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
    const { address, src_version } = await context({
        $el: $claim
    });
    const { mty_treasury } = await contracts({
        token, src_version
    });
    if (!mty_treasury) {
        throw new Error('undefined mty_treasury');
    }
    //
    // Check allowance:
    //
    const ids = Nft.realIds(Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels()),
        token: Nft.token(token)
    }));
    const src_claimables: BigNumber[] = await mty_treasury.claimableForBatch(
        x40(address), ids
    );
    console.debug(
        `[${src_version}:claimables]`, src_claimables.map((b) => b.toString())
    );
    const src_claimable = src_claimables.reduce(
        (acc, c) => acc.add(c), BigNumber.from(0)
    );
    if (src_claimable.isZero()) {
        alert(
            `No claimable rewards; you can continue now.`,
            Alert.info, { after: $claim.parent('div')[0] }
        );
        return;
    }
    const src_treasure: BigNumber = await mty_treasury.balance();
    console.debug(
        `[${src_version}:balance]`, src_treasure.toString()
    );
    if (src_treasure.isZero()) {
        alert(
            `Empty treasury; you cannot claim any rewards.`,
            Alert.warning, { after: $claim.parent('div')[0] }
        );
        return;
    }
    if (src_treasure.lt(src_claimable)) {
        alert(
            `Insufficient treasury; you cannot claim any rewards.`,
            Alert.warning, { after: $claim.parent('div')[0] }
        );
        return;
    }
    //
    // Claim tokens:
    //
    const reset = $claim.ing();
    Alerts.hide();
    try {
        const nz = filter(ids, src_claimables, {
            zero: false
        });
        mty_treasury.on(
            'ClaimBatch', <OnClaimBatch>((
                account, ids, amounts, ev
            ) => {
                if (ev.transactionHash !== tx?.hash) {
                    return;
                }
                alert(
                    `Rewards have been claimed; you can continue now.`,
                    Alert.success, { after: $claim.parent('div')[0] }
                );
                reset();
            })
        );
        const tx: Transaction = await mty_treasury.claimForBatch(
            x40(address), nz.ids
        );
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
        reset();
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
async function context({ $el: $approve }: {
    $el: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const src_version = $approve.data('source');
    if (!src_version) {
        throw new Error('missing data-source');
    }
    const tgt_version = $approve.data('target');
    if (!tgt_version) {
        throw new Error('missing data-target');
    }
    return { address, src_version, tgt_version };
}
async function contracts({
    token, src_version
}: {
    token: Token, src_version: Version
}) {
    let mty_treasury: Contract | undefined;
    try {
        mty_treasury = await MoeTreasuryFactory({
            token, version: src_version
        });
        console.debug(
            `[${src_version}:mty_treasury]`, mty_treasury.address
        );
    } catch (ex) {
        console.error(ex);
    }
    return {
        mty_treasury,
    };
}
