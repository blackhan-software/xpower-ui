/* eslint @typescript-eslint/no-explicit-any: [off] */
import './any-claim.scss';

import { Contract, Transaction } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { MoeTreasury, MoeTreasuryFactory, OnClaimBatch, XPowerMoeFactory } from '../../source/contract';
import { Alert, Alerts, alert } from '../../source/functions';
import { Balance, Nft, NftLevels, Token } from '../../source/redux/types';
import { Version } from '../../source/types';
import { Years } from '../../source/years';

Blockchain.onConnect(function enableAllowanceButton() {
    const $claim_any = $('.claim-any').filter((i, el) => {
        const source = new RegExp($(el).data('source'));
        return 'v2a|v2b|v2c|v3a|v3b'.match(source) === null;
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
    const { src_xpower, mty_source } = await contracts({
        token, src_version
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
        levels: Array.from(NftLevels()),
        token: Nft.token(token)
    });
    const src_claimables = await mty_source.claimableForBatch(
        address, Nft.realIds(ids, { version: src_version })
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
    const src_treasure = await mtyBalanceOf(token, {
        $claim
    });
    console.debug(
        `[${src_version}:balance]`, src_treasure.toString()
    );
    if (src_treasure === 0n) {
        alert(
            `Empty treasury; you cannot claim any rewards.`,
            Alert.warning, { after: $claim.parent('div')[0] }
        );
        return;
    }
    if (src_treasure < src_claimable) {
        alert(
            `Insufficient treasury; you cannot claim all rewards.`,
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
        const nz = filter(ids, src_claimables);
        mty_source.onClaimBatch(<OnClaimBatch>((
            account, nft_ids, amounts, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Rewards have been claimed; you can continue now.`,
                Alert.success, { after: $claim.parent('div')[0] }
            );
            reset();
        }));
        const tx: Transaction = await mty_source.claimForBatch(
            address, Nft.realIds(nz.ids, { version: src_version })
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
async function mtyBalanceOf(token: Token, { $claim }: {
    $claim: JQuery<HTMLElement>
}) {
    const { src_version } = await context({
        $el: $claim
    });
    const { src_xpower, mty_source } = await contracts({
        token, src_version
    });
    if (!src_xpower) {
        throw new Error('undefined src_xpower');
    }
    if (!mty_source) {
        throw new Error('undefined mty_treasury');
    }
    try {
        const moe_index = await mty_source.moeIndexOf(
            BigInt(src_xpower.address)
        );
        return await mty_source.moeBalanceOf(moe_index);
    } catch (ex) {
        console.error(ex);
    }
    return 0n;
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
    let src_xpower: Contract | undefined;
    try {
        src_xpower = await XPowerMoeFactory({
            token, version: src_version
        }).connect();
        console.debug(
            `[${src_version}:src_xpower]`, src_xpower.address
        );
    } catch (ex) {
        console.error(ex);
    }
    let mty_source: MoeTreasury | undefined;
    try {
        mty_source = await MoeTreasuryFactory({
            token, version: src_version
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
