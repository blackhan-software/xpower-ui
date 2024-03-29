/* eslint @typescript-eslint/no-explicit-any: [off] */
import './nft-migrate.scss';

import { Transaction } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { PptTreasury, PptTreasuryFactory } from '../../source/contract';
import { Alert, Alerts, alert, x40 } from '../../source/functions';
import { Account, Balance, MAX_UINT256, Nft, NftLevels } from '../../source/redux/types';
import { Version } from '../../source/types';
import { MoeWallet, NftWallet, PptWallet } from '../../source/wallet';
import { Years } from '../../source/years';

Blockchain.onConnect(function enableUnstake() {
    const $unstake_ppt = $('.unstake-old').filter((i, el) => {
        const source = new RegExp($(el).data('source'));
        return 'v1a|v2a|v2b|v2c|v3a|v3b'.match(source) === null;
    });
    $unstake_ppt.prop('disabled', false);
});
Blockchain.onConnect(function enableAllowance() {
    const $approve_old = $('.approve-old').filter((i, el) => {
        const source = new RegExp($(el).data('source'));
        return 'v1a|v2a|v2b|v2c|v3a|v3b'.match(source) !== null;
    });
    $approve_old.prop('disabled', false);
});
$('button.unstake-old').on('click', async function unstakeOldNfts(e) {
    const $unstake = $(e.currentTarget);
    const $unstake_ppt = $unstake.parents('form.unstake-old');
    const $migrate_nft = $unstake_ppt.next('form.migrate-old');
    if ($unstake.hasClass('xpow')) {
        await nftUnstakeOld({
            $unstake, $approve: $migrate_nft.find(
                '.approve-old.xpow'
            )
        });
    }
});
async function nftUnstakeOld({ $unstake, $approve }: {
    $unstake: JQuery<HTMLElement>, $approve: JQuery<HTMLElement>
}) {
    const { account, src_version, tgt_version } = await context({
        $el: $unstake
    });
    const { ppt_source, nty_source } = await contracts({
        account, src_version, tgt_version
    });
    if (!ppt_source) {
        throw new Error('undefined ppt_source');
    }
    if (!nty_source) {
        throw new Error('undefined nty_source');
    }
    //
    // Check balances:
    //
    const ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const src_balances: Balance[] = await ppt_source.balances({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    console.debug(
        `[${src_version}:balances]`, src_balances.map((b) => b.toString())
    );
    const src_zero = src_balances.reduce((acc, b) => acc && !b, true);
    if (src_zero) {
        alert(
            `Old NFTs have already been unstaked; you can continue now.`,
            Alert.info, { after: $unstake.parent('div')[0] }
        );
        $approve.prop('disabled', false);
        return;
    }
    //
    // Unstake tokens:
    //
    let tx: Transaction | undefined;
    const reset = $unstake.ing();
    Alerts.hide();
    try {
        nty_source.onUnstakeBatch((
            account, nft_ids, amounts, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Old NFTs have been unstaked; you can continue now.`,
                Alert.success, { after: $unstake.parent('div')[0] }
            );
            $approve.prop('disabled', false);
            reset();
        });
        const nz = filter(ids, src_balances, {
            zero: false
        });
        tx = await nty_source.unstakeBatch(
            account, nz.ids, nz.balances
        );
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $unstake.parent('div')[0]
            });
        }
        console.error(ex);
        reset();
    }
}
$('button.approve-old').on('click', async function approveOldNfts(e) {
    const $approve = $(e.currentTarget);
    const $migrate_nft = $approve.parents('form.migrate-old');
    if ($approve.hasClass('xpow')) {
        await moeApproveOld({
            $approve
        });
        await moeApproveNew({
            $approve
        });
        await moeApproveNft({
            $approve
        });
        await nftApproveOld({
            $approve, $migrate: $migrate_nft.find(
                '.migrate-old.xpow'
            )
        });
    }
});
async function moeApproveOld({ $approve }: {
    $approve: JQuery<HTMLElement>
}) {
    const { account, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { src_xpower, tgt_xpower } = await contracts({
        account, src_version, tgt_version
    });
    const { nft_source } = await contracts({
        account, src_version, tgt_version
    });
    if (!src_xpower) {
        throw new Error('undefined src_xpower');
    }
    if (!tgt_xpower) {
        throw new Error('undefined tgt_xpower');
    }
    if (!nft_source) {
        throw new Error('undefined nft_source');
    }
    //
    // Check balances:
    //
    const src_balances: Balance[] = await nft_source.balances({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    console.debug(
        `[${src_version}:balances]`, src_balances.map((b) => b.toString())
    );
    const src_zero = src_balances.reduce(
        (acc, b) => acc && !b, true
    );
    if (src_zero) {
        return;
    }
    //
    // Check allowance:
    //
    const src_allowance = await src_xpower.allowance(
        x40(account), await tgt_xpower.address
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toString()
    );
    if (src_allowance === MAX_UINT256) {
        return;
    }
    //
    // Increase allowance:
    //
    let tx: Transaction | undefined;
    const reset = $approve.ing();
    Alerts.hide();
    try {
        src_xpower.onApproval((
            owner, spender, value, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            reset();
        });
        tx = await src_xpower.approve(
            await tgt_xpower.address, MAX_UINT256
        );
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $approve.parent('div')[0]
            });
        }
        console.error(ex);
        reset();
    }
}
async function moeApproveNew({ $approve }: {
    $approve: JQuery<HTMLElement>
}) {
    const { account, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { nft_source, nft_target } = await contracts({
        account, src_version, tgt_version
    });
    const { tgt_xpower } = await contracts({
        account, src_version, tgt_version
    });
    if (!nft_source) {
        throw new Error('undefined nft_source');
    }
    if (!nft_target) {
        throw new Error('undefined nft_target');
    }
    if (!tgt_xpower) {
        throw new Error('undefined tgt_xpower');
    }
    //
    // Check balances:
    //
    const src_balances: Balance[] = await nft_source.balances({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    console.debug(
        `[${src_version}:balances]`, src_balances.map((b) => b.toString())
    );
    const src_zero = src_balances.reduce(
        (acc, b) => acc && !b, true
    );
    if (src_zero) {
        return;
    }
    //
    // Check allowance:
    //
    const tgt_allowance = await tgt_xpower.allowance(
        x40(account), await nft_target.address
    );
    console.debug(
        `[${tgt_version}:allowance]`, tgt_allowance.toString()
    );
    if (tgt_allowance === MAX_UINT256) {
        return;
    }
    //
    // Increase allowance:
    //
    let tx: Transaction | undefined;
    const reset = $approve.ing();
    Alerts.hide();
    try {
        tgt_xpower.onApproval((
            owner, spender, value, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            reset();
        });
        tx = await tgt_xpower.approve(
            await nft_target.address, MAX_UINT256
        );
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $approve.parent('div')[0]
            });
        }
        console.error(ex);
        reset();
    }
}
async function moeApproveNft({ $approve }: {
    $approve: JQuery<HTMLElement>
}) {
    const { account, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { tgt_xpower, nft_target } = await contracts({
        account, src_version, tgt_version
    });
    if (!tgt_xpower) {
        throw new Error('undefined tgt_xpower');
    }
    if (!nft_target) {
        throw new Error('undefined nft_target');
    }
    //
    // Approved migrate?
    //
    const tgt_approved = await tgt_xpower.approvedMigrate(
        x40(account), await nft_target.address
    );
    console.debug(
        `[${tgt_version}:approved-migrate]`, tgt_approved.toString()
    );
    if (tgt_approved) {
        return;
    }
    //
    // Approve migrate:
    //
    let tx: Transaction | undefined;
    const reset = $approve.ing();
    Alerts.hide();
    try {
        tgt_xpower.onApproveMigrate((
            acc, op, flag, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            reset();
        });
        tx = await tgt_xpower.approveMigrate(
            await nft_target.address, true
        );
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $approve.parent('div')[0]
            });
        }
        console.error(ex);
        reset();
    }
}
async function nftApproveOld({ $approve, $migrate }: {
    $approve: JQuery<HTMLElement>, $migrate: JQuery<HTMLElement>
}) {
    const { account, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { nft_source, nft_target } = await contracts({
        account, src_version, tgt_version
    });
    if (!nft_source) {
        throw new Error('undefined nft_source');
    }
    if (!nft_target) {
        throw new Error('undefined nft_target');
    }
    //
    // Check approval:
    //
    const src_approved = await nft_source.isApprovedForAll(
        await nft_target.address
    );
    console.debug(
        `[${src_version}:approved]`, src_approved
    );
    const src_balances: Balance[] = await nft_source.balances({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    console.debug(
        `[${src_version}:balances]`, src_balances.map((b) => b.toString())
    );
    const src_zero = src_balances.reduce(
        (acc, b) => acc && !b, true
    );
    if (src_approved || src_zero) {
        alert(
            `Old NFTs have already been approved for; you can migrate now.`,
            Alert.info, { after: $approve.parent('div')[0] }
        );
        $migrate.prop('disabled', false);
        return;
    }
    //
    // Approve tokens:
    //
    let tx: Transaction | undefined;
    const reset = $approve.ing();
    Alerts.hide();
    try {
        nft_source.onApprovalForAll((
            account, operator, approved, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Old NFTs have been approved for; you can migrate now.`,
                Alert.success, { after: $approve.parent('div')[0] }
            );
            $migrate.prop('disabled', false);
            reset();
        });
        tx = await nft_source.setApprovalForAll(
            await nft_target.address, true
        );
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $approve.parent('div')[0]
            });
        }
        console.error(ex);
        reset();
    }
}
$('button.migrate-old').on('click', async function migrateOldNfts(e) {
    const $migrate = $(e.currentTarget);
    const $migrate_nft = $migrate.parents('form.migrate-old');
    const $restake_nft = $migrate_nft.next('form.restake-new');
    if ($migrate.hasClass('xpow')) {
        await nftMigrateOld({
            $migrate, $approve: $restake_nft.find(
                '.approve-new.xpow'
            )
        });
    }
});
async function nftMigrateOld({ $migrate, $approve }: {
    $migrate: JQuery<HTMLElement>, $approve: JQuery<HTMLElement>
}) {
    const { account, src_version, tgt_version } = await context({
        $el: $migrate
    });
    const { src_xpower, tgt_xpower } = await contracts({
        account, src_version, tgt_version
    });
    const { nft_source, nft_target } = await contracts({
        account, src_version, tgt_version
    });
    if (!src_xpower) {
        throw new Error('undefined src_xpower');
    }
    if (!tgt_xpower) {
        throw new Error('undefined tgt_xpower');
    }
    if (!nft_source) {
        throw new Error('undefined nft_source');
    }
    if (!nft_target) {
        throw new Error('undefined nft_target');
    }
    //
    // Check balances:
    //
    const ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const src_balances: Balance[] = await nft_source.balances({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    console.debug(
        `[${src_version}:balances]`, src_balances.map((b) => b.toString())
    );
    const src_zero = src_balances.reduce(
        (acc, b) => acc && !b, true
    );
    if (src_zero) {
        alert(
            `Old NFT balances are zero; nothing to migrate here.`,
            Alert.warning, { after: $migrate.parent('div')[0] }
        );
        $approve.prop('disabled', false);
        return;
    }
    //
    // Check approval:
    //
    const src_approved = await nft_source.isApprovedForAll(
        await nft_target.address
    );
    if (src_approved === false) {
        alert(
            `No approval; did your approval transaction confirm?`,
            Alert.warning, { after: $migrate.parent('div')[0] }
        );
        return;
    }
    //
    // Migrate tokens:
    //
    let tx: Transaction | undefined;
    const reset = $migrate.ing();
    Alerts.hide();
    try {
        nft_target.onTransferBatch((
            op, from, to, ids, values, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Old NFTs have been migrated! ;)`,
                Alert.success, { id: 'success', after: $migrate.parent('div')[0] }
            );
            $approve.prop('disabled', false);
            reset();
        });
        const nz = filter(ids, src_balances, { zero: false });
        const nft_index = await nft_target.get.then(
            (c) => c.oldIndexOf(nft_source.address)
        );
        const moe_index = await tgt_xpower.get.then(
            (c) => c.oldIndexOf(src_xpower.address)
        );
        tx = await nft_target.put.then((c) => c.migrateBatch(
            Nft.realIds(nz.ids, { version: tgt_version }), nz.balances, [
                nft_index, moe_index
            ]
        ));
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $migrate.parent('div')[0]
            });
        }
        console.error(ex);
        reset();
    }
}
$('button.approve-new').on('click', async function approveNewNfts(e) {
    const $approve = $(e.currentTarget);
    const $restake_nft = $approve.parents('form.restake-new');
    if ($approve.hasClass('xpow')) {
        await nftApproveNew({
            $approve, $restake: $restake_nft.find(
                '.restake-new.xpow'
            )
        });
    }
});
async function nftApproveNew({ $approve, $restake }: {
    $approve: JQuery<HTMLElement>, $restake: JQuery<HTMLElement>
}) {
    const { account, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { nft_target, nty_target } = await contracts({
        account, src_version, tgt_version
    });
    if (!nft_target) {
        throw new Error('undefined nft_target');
    }
    if (!nty_target) {
        throw new Error('undefined nty_target');
    }
    //
    // Check approval:
    //
    const tgt_approved = await nft_target.isApprovedForAll(
        nty_target.address
    );
    console.debug(
        `[${tgt_version}:approved]`, tgt_approved
    );
    const tgt_balances: Balance[] = await nft_target.balances({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    console.debug(
        `[${tgt_version}:balances]`, tgt_balances.map((b) => b.toString())
    );
    const tgt_zero = tgt_balances.reduce(
        (acc, b) => acc && !b, true
    );
    if (tgt_approved || tgt_zero) {
        alert(
            `New NFTs have already been approved for; you can restake now.`,
            Alert.info, { after: $approve.parent('div')[0] }
        );
        $restake.prop('disabled', false);
        return;
    }
    //
    // Approve tokens:
    //
    let tx: Transaction | undefined;
    const reset = $approve.ing();
    Alerts.hide();
    try {
        nft_target.onApprovalForAll((
            account, operator, approved, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `New NFTs have been approved for; you can restake now.`,
                Alert.success, { after: $approve.parent('div')[0] }
            );
            $restake.prop('disabled', false);
            reset();
        });
        tx = await nft_target.setApprovalForAll(
            nty_target.address, true
        );
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $approve.parent('div')[0]
            });
        }
        console.error(ex);
        reset();
    }
}
$('button.restake-new').on('click', async function restakeNewNfts(e) {
    const $restake = $(e.currentTarget);
    if ($restake.hasClass('xpow')) {
        await nftRestakeNew({ $restake });
    }
});
async function nftRestakeNew({ $restake }: {
    $restake: JQuery<HTMLElement>
}) {
    const { account, src_version, tgt_version } = await context({
        $el: $restake
    });
    const { nft_target, nty_target } = await contracts({
        account, src_version, tgt_version
    });
    if (!nft_target) {
        throw new Error('undefined nft_target');
    }
    if (!nty_target) {
        throw new Error('undefined nty_target');
    }
    //
    // Check balances:
    //
    const ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const tgt_balances: Balance[] = await nft_target.balances({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    console.debug(
        `[${tgt_version}:balances]`, tgt_balances.map((b) => b.toString())
    );
    const tgt_zero = tgt_balances.reduce(
        (acc, b) => acc && !b, true
    );
    if (tgt_zero) {
        alert(
            `New NFT balances are zero; nothing to restake here.`,
            Alert.warning, { after: $restake.parent('div')[0] }
        );
        return;
    }
    //
    // Restake tokens:
    //
    let tx: Transaction | undefined;
    const reset = $restake.ing();
    Alerts.hide();
    try {
        nty_target.onStakeBatch((
            accound, nft_ids, amounts, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `New NFTs have been restaked; you are done now. ;)`,
                Alert.success, { after: $restake.parent('div')[0] }
            );
            reset();
        });
        const nz = filter(ids, tgt_balances, {
            zero: false
        });
        tx = await nty_target.stakeBatch(
            account, nz.ids, nz.balances
        );
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $restake.parent('div')[0]
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
    const tgt_version = $approve.data('target');
    if (!tgt_version) {
        throw new Error('missing data-target');
    }
    return { account, src_version, tgt_version };
}
async function contracts({
    account, src_version, tgt_version
}: {
    account: Account, src_version: Version, tgt_version: Version
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
    let tgt_xpower: MoeWallet | undefined;
    try {
        tgt_xpower = new MoeWallet(
            account, tgt_version
        );
        console.debug(
            `[${tgt_version}:tgt_xpower]`, await tgt_xpower.address
        );
    } catch (ex) {
        console.error(ex);
    }
    let nft_source: NftWallet | undefined;
    try {
        nft_source = new NftWallet(
            account, src_version
        );
        console.debug(
            `[${src_version}:nft_source]`, await nft_source.address
        );
    } catch (ex) {
        console.error(ex);
    }
    let nft_target: NftWallet | undefined;
    try {
        nft_target = new NftWallet(
            account, tgt_version
        );
        console.debug(
            `[${tgt_version}:nft_target]`, await nft_target.address
        );
    } catch (ex) {
        console.error(ex);
    }
    let ppt_source: PptWallet | undefined;
    try {
        ppt_source = new PptWallet(
            account, src_version
        );
        console.debug(
            `[${src_version}:ppt_source]`, await ppt_source.address
        );
    } catch (ex) {
        console.error(ex);
    }
    let ppt_target: PptWallet | undefined;
    try {
        ppt_target = new PptWallet(
            account, tgt_version
        );
        console.debug(
            `[${tgt_version}:ppt_target]`, await ppt_target.address
        );
    } catch (ex) {
        console.error(ex);
    }
    let nty_source: PptTreasury | undefined;
    try {
        nty_source = PptTreasuryFactory({
            version: src_version
        });
        console.debug(
            `[${src_version}:nty_source]`, nty_source.address
        );
    } catch (ex) {
        console.error(ex);
    }
    let nty_target: PptTreasury | undefined;
    try {
        nty_target = PptTreasuryFactory({
            version: tgt_version
        });
        console.debug(
            `[${tgt_version}:nty_target]`, nty_target.address
        );
    } catch (ex) {
        console.error(ex);
    }
    return {
        src_xpower, nft_source, ppt_source, nty_source,
        tgt_xpower, nft_target, ppt_target, nty_target,
    };
}
