/* eslint @typescript-eslint/no-explicit-any: [off] */
import './nft-migrate.scss';

import { BigNumber } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { PptTreasuryFactory, XPowerNftFactory, XPowerPptFactory } from '../../source/contract';
import { Alert, alert, Alerts, x40 } from '../../source/functions';
import { Nft, NftLevels, Token } from '../../source/redux/types';
import { Years } from '../../source/years';

Blockchain.onConnect(function enableAllowanceButton() {
    const $approve_nft = $('.approve-allowance-nft:not([data-source=v4a])');
    $approve_nft.prop('disabled', false);
    const $unstake_ppt = $('.unstake-ppt');
    $unstake_ppt.prop('disabled', false);
});
$('button.unstake-ppt').on('click', async function unstakeTokens(e) {
    const $unstake = $(e.target);
    const $unstake_ppt = $unstake.parents('form.unstake-ppt');
    const $allowance_nft = $unstake_ppt.next('form.allowance-nft');
    if ($unstake.hasClass('thor')) {
        await unstake(Token.THOR, {
            $unstake, $approve: $allowance_nft.find(
                '.approve-allowance-nft.thor'
            )
        });
    }
    if ($unstake.hasClass('loki')) {
        await unstake(Token.LOKI, {
            $unstake, $approve: $allowance_nft.find(
                '.approve-allowance-nft.loki'
            )
        });
    }
    if ($unstake.hasClass('odin')) {
        await unstake(Token.ODIN, {
            $unstake, $approve: $allowance_nft.find(
                '.approve-allowance-nft.odin'
            )
        });
    }
});
async function unstake(token: Token, { $unstake, $approve }: {
    $unstake: JQuery<HTMLElement>, $approve: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const src_version = $unstake.data('source');
    if (!src_version) {
        throw new Error('missing data-source');
    }
    const src_xpower = await XPowerPptFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_xpower.address
    );
    const ids = Nft.coreIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const accounts = ids.map(() => {
        return x40(address);
    });
    const src_balances: BigNumber[] = await src_xpower.balanceOfBatch(
        accounts, ids
    );
    console.debug(
        `[${src_version}:balances]`, src_balances.map((b) => b.toString())
    );
    const src_zero = src_balances.reduce((acc, b) => acc && b.isZero(), true);
    if (src_zero) {
        alert(
            `NFTs have already been unstaked; you can continue now.`,
            Alert.info, { after: $unstake.parent('div')[0] }
        );
        $approve.prop('disabled', false);
        return;
    }
    const src_treasury = await PptTreasuryFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_treasury.address
    );
    Alerts.hide();
    try {
        const nz = filter(ids, src_balances, { zero: false });
        await src_treasury.unstakeBatch(
            x40(address), nz.ids, nz.balances
        );
        alert(
            `NFTs have successfully been unstaked; you can continue now.`,
            Alert.success, { after: $unstake.parent('div')[0] }
        );
        $approve.prop('disabled', false);
        return;
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
    }
}
$('button.approve-allowance-nft').on('click', async function approveTokens(e) {
    const $approve = $(e.target);
    const $allowance_nft = $approve.parents('form.allowance-nft');
    const $migration_nft = $allowance_nft.next('form.migration-nft');
    if ($approve.hasClass('thor')) {
        await approve(Token.THOR, {
            $approve, $execute: $migration_nft.find(
                '.execute-migration-nft.thor'
            )
        });
    }
    if ($approve.hasClass('loki')) {
        await approve(Token.LOKI, {
            $approve, $execute: $migration_nft.find(
                '.execute-migration-nft.loki'
            )
        });
    }
    if ($approve.hasClass('odin')) {
        await approve(Token.ODIN, {
            $approve, $execute: $migration_nft.find(
                '.execute-migration-nft.odin'
            )
        });
    }
});
async function approve(token: Token, { $approve, $execute }: {
    $approve: JQuery<HTMLElement>, $execute: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const src_version = $approve.data('source');
    if (!src_version) {
        throw new Error('missing data-source');
    }
    const src_xpower = await XPowerNftFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_xpower.address
    );
    const tgt_version = $approve.data('target');
    if (!tgt_version) {
        throw new Error('missing data-target');
    }
    const tgt_xpower = await XPowerNftFactory({
        token, version: tgt_version
    });
    console.debug(
        `[${tgt_version}:contract]`, tgt_xpower.address
    );
    const src_approved = await src_xpower.isApprovedForAll(
        x40(address), tgt_xpower.address
    );
    console.debug(
        `[${src_version}:approved]`, src_approved
    );
    const ids = Nft.coreIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const accounts = ids.map(() => {
        return x40(address);
    });
    const src_balances: BigNumber[] = await src_xpower.balanceOfBatch(
        accounts, ids
    );
    console.debug(
        `[${src_version}:balances]`, src_balances.map((b) => b.toString())
    );
    const src_zero = src_balances.reduce((acc, b) => acc && b.isZero(), true);
    if (src_approved || src_zero) {
        alert(
            `NFTs have already been approved for; you can migrate now.`,
            Alert.info, { after: $approve.parent('div')[0] }
        );
        $execute.prop('disabled', false);
        return;
    }
    Alerts.hide();
    try {
        await src_xpower.setApprovalForAll(
            tgt_xpower.address, true
        );
        alert(
            `NFTs have successfully been approved for; you can migrate now.`,
            Alert.success, { after: $approve.parent('div')[0] }
        );
        $execute.prop('disabled', false);
        return;
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
    }
}
$('button.execute-migration-nft').on('click', async function migrateTokens(e) {
    const $execute = $(e.target);
    if ($execute.hasClass('thor')) {
        await migrate(Token.THOR, { $execute });
    }
    if ($execute.hasClass('loki')) {
        await migrate(Token.LOKI, { $execute });
    }
    if ($execute.hasClass('odin')) {
        await migrate(Token.ODIN, { $execute });
    }
});
async function migrate(token: Token, { $execute }: {
    $execute: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const src_version = $execute.data('source');
    if (!src_version) {
        throw new Error('missing data-source');
    }
    const src_xpower = await XPowerNftFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_xpower.address
    );
    const tgt_version = $execute.data('target');
    if (!tgt_version) {
        throw new Error('missing data-target');
    }
    const tgt_xpower = await XPowerNftFactory({
        token, version: tgt_version
    });
    console.debug(
        `[${tgt_version}:contract]`, tgt_xpower.address
    );
    const ids = Nft.coreIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const accounts = ids.map(() => {
        return x40(address);
    });
    const src_balances: BigNumber[] = await src_xpower.balanceOfBatch(
        accounts, ids
    );
    console.debug(
        `[${src_version}:balances]`, src_balances.map((b) => b.toString())
    );
    const src_zero = src_balances.reduce((acc, b) => acc && b.isZero(), true);
    if (src_zero) {
        alert(
            `Your old NFT balance is zero; nothing to migrate here.`,
            Alert.warning, { after: $execute.parent('div')[0] }
        );
        return;
    }
    const src_approved = await src_xpower.isApprovedForAll(
        x40(address), tgt_xpower.address
    );
    if (src_approved === false) {
        alert(
            `Old NFTs have not been approved for! ` +
            `Did your approval transaction actually get confirmed? ` +
            `Wait a little bit and then retry.`,
            Alert.warning, { after: $execute.parent('div')[0] }
        );
        return;
    }
    const nz = filter(ids, src_balances, { zero: false });
    Alerts.hide();
    try {
        await tgt_xpower.migrateBatch(nz.ids, nz.balances);
        alert(
            `Your old NFTs have successfully been migrated! ;)`,
            Alert.success, { id: 'success', after: $execute.parent('div')[0] }
        );
        return;
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $execute.parent('div')[0]
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
