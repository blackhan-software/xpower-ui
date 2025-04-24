/* eslint @typescript-eslint/no-explicit-any: [off] */
import './any-claim.scss';

import { TransactionResponse } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { MoeTreasury, MoeTreasuryFactory } from '../../source/contract';
import { Alert, Alerts, alert } from '../../source/functions';
import { Account, Balance, Nft, NftLevels } from '../../source/redux/types';
import { Version } from '../../source/types';
import { MoeWallet } from '../../source/wallet';
import { Years } from '../../source/years';

Blockchain.onConnect(function enableAllowanceButton() {
    const $claim_any = $('.claim-any').filter((i, el) => {
        const source = new RegExp($(el).data('source'));
        return 'v1a|v2a|v2b|v2c|v3a|v3b'.match(source) === null;
    });
    $claim_any.prop('disabled', false);
});
$('button.claim-any').on('click', async function claimTokens(e) {
    const $claim = $(e.currentTarget);
    if ($claim.hasClass('xpow')) {
        const reset = $claim.ing();
        await claim({ $claim });
        reset();
    }
});
async function claim({ $claim }: {
    $claim: JQuery<HTMLElement>
}) {
    const { account, src_version } = await context({
        $el: $claim
    });
    const { src_xpower, mty_source } = await contracts({
        account, src_version
    });
    if (!src_xpower) {
        throw new Error('undefined src_xpower');
    }
    if (!mty_source) {
        throw new Error('undefined mty_treasury');
    }
    //
    // Check allowance:
    //
    const ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const src_claimables = await mty_source.claimableBatch(
        account, ids
    );
    console.debug(
        `[${src_version}:claimables]`, src_claimables
    );
    const src_claimable = src_claimables.reduce(
        (acc, c) => acc + c, 0n
    );
    if (src_claimable === 0n) {
        alert(
            `No claimable rewards; you can continue now.`,
            Alert.info, { after: $claim.parent('div')[0] }
        );
        return;
    }
    //
    // Claim tokens:
    //
    const reset = $claim.ing();
    Alerts.hide();
    try {
        const nz = filter(ids, src_claimables);
        mty_source.onClaimBatch((
            account, nft_ids, amounts, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Rewards have been claimed; you can continue now.`,
                Alert.success, { after: $claim.parent('div')[0] }
            );
            reset();
        });
        const tx: TransactionResponse = await mty_source.claimBatch(
            account, nz.ids
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
function filter<I>(
    ids: Array<I>, balances: Balance[]
) {
    const ids_nz = [];
    const balances_nz = [];
    for (let i = 0; i < balances.length; i++) {
        if (balances[i] === 0n) {
            continue;
        }
        balances_nz.push(balances[i]);
        ids_nz.push(ids[i]);
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
    const tgt_version = $approve.data('target');
    if (!tgt_version) {
        throw new Error('missing data-target');
    }
    return { account, src_version, tgt_version };
}
async function contracts({
    account, src_version
}: {
    account: Account, src_version: Version
}) {
    let src_xpower: MoeWallet | undefined;
    try {
        src_xpower = new MoeWallet(
            account, src_version
        );
        console.debug(
            `[${src_version}:src_xpower]`, await src_xpower.address
        );
    } catch (ex) {
        console.error(ex);
    }
    let mty_source: MoeTreasury | undefined;
    try {
        mty_source = MoeTreasuryFactory({
            version: src_version
        });
        console.debug(
            `[${src_version}:mty_source]`, mty_source.address
        );
    } catch (ex) {
        console.error(ex);
    }
    return {
        src_xpower,
        mty_source,
    };
}
