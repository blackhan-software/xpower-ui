/* eslint @typescript-eslint/no-explicit-any: [off] */
import './moe-migrate.scss';

import { Blockchain } from '../../source/blockchain';
import { XPowerMoeFactory } from '../../source/contract';
import { Alerts, Alert, alert, x40 } from '../../source/functions';
import { Token } from '../../source/redux/types';

Blockchain.onConnect(function enableAllowanceButton() {
    const $approve = $('.approve-allowance');
    $approve.prop('disabled', false);
});
$('button.approve-allowance').on(
    'click', async function approveTokens(e) {
        const $approve = $(e.target);
        const $allowance = $approve.parents('form.moe-allowance');
        const $migration = $allowance.next('form.moe-migration');
        if ($approve.hasClass('thor')) {
            await approve(Token.THOR, {
                $approve, $execute: $migration.find('.execute-migration.thor')
            });
        }
        if ($approve.hasClass('loki')) {
            await approve(Token.LOKI, {
                $approve, $execute: $migration.find('.execute-migration.loki')
            });
        }
        if ($approve.hasClass('odin')) {
            await approve(Token.ODIN, {
                $approve, $execute: $migration.find('.execute-migration.odin')
            });
        }
    }
);
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
    const src_xpower = await XPowerMoeFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_xpower.address
    );
    const tgt_version = $approve.data('target');
    if (!tgt_version) {
        throw new Error('missing data-target');
    }
    const tgt_xpower = await XPowerMoeFactory({
        token, version: tgt_version
    });
    console.debug(
        `[${tgt_version}:contract]`, tgt_xpower.address
    );
    const src_balance = await src_xpower.balanceOf(
        x40(address)
    );
    const src_allowance = await src_xpower.allowance(
        x40(address), tgt_xpower.address
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toNumber()
    );
    if (src_allowance.gte(src_balance)) {
        alert(
            `Allowance has already been approved; you can migrate now.`,
            Alert.info, { after: $approve.parent('div')[0] }
        );
        $execute.prop('disabled', false);
        return;
    }
    Alerts.hide();
    try {
        await src_xpower.increaseAllowance(
            tgt_xpower.address, src_balance.sub(src_allowance)
        );
        alert(
            `Allowance has successfully been approved; you can migrate now.`,
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
$('button.execute-migration').on(
    'click', async function migrateTokens(e) {
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
    }
);
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
    const src_xpower = await XPowerMoeFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_xpower.address
    );
    const tgt_version = $execute.data('target');
    if (!tgt_version) {
        throw new Error('missing data-target');
    }
    const tgt_xpower = await XPowerMoeFactory({
        token, version: tgt_version
    });
    console.debug(
        `[${tgt_version}:contract]`, tgt_xpower.address
    );
    const src_balance = await src_xpower.balanceOf(
        x40(address)
    );
    console.debug(
        `[${src_version}:balance]`, src_balance.toNumber()
    );
    if (src_balance.isZero()) {
        alert(
            `Your old balance is zero; nothing to migrate here.`,
            Alert.warning, { after: $execute.parent('div')[0] }
        );
        return;
    }
    const tgt_spender = tgt_xpower.address;
    const src_allowance = await src_xpower.allowance(
        x40(address), tgt_spender
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toNumber()
    );
    if (src_allowance.isZero()) {
        alert(
            `Old allowance is zero; approve allowance! ` +
            `Did your allowance transaction actually get confirmed? ` +
            `Wait a little bit and then retry.`,
            Alert.warning, { after: $execute.parent('div')[0] }
        );
        return;
    }
    Alerts.hide();
    try {
        await tgt_xpower.migrate(src_balance);
        alert(
            `Your old balance has successfully been migrated! ;)`,
            Alert.success, { after: $execute.parent('div')[0], id: 'success' }
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
