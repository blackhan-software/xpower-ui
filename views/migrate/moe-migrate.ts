/* eslint @typescript-eslint/no-explicit-any: [off] */
import './moe-migrate.scss';

import { Contract, Transaction } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { XPowerMoeFactory } from '../../source/contract';
import { Alert, alert, Alerts, x40 } from '../../source/functions';
import { MAX_UINT256, Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { Version } from '../../source/types';

Blockchain.onConnect(function enableAllowance() {
    const $approve = $('.approve-moe-allowance');
    $approve.prop('disabled', false);
});
$('button.approve-moe-allowance').on(
    'click', async function approveTokens(e) {
        const $approve = $(e.currentTarget);
        const $migrate = $approve.parents('form.moe-migrate');
        if ($approve.hasClass('thor')) {
            await moeApproveOld(Token.THOR, {
                $approve, $migrate: $migrate.find(
                    '.moe-migrate.thor'
                )
            });
        }
        if ($approve.hasClass('loki')) {
            await moeApproveOld(Token.LOKI, {
                $approve, $migrate: $migrate.find(
                    '.moe-migrate.loki'
                )
            });
        }
        if ($approve.hasClass('odin')) {
            await moeApproveOld(Token.ODIN, {
                $approve, $migrate: $migrate.find(
                    '.moe-migrate.odin'
                )
            });
        }
    }
);
async function moeApproveOld(token: Token, { $approve, $migrate }: {
    $approve: JQuery<HTMLElement>, $migrate: JQuery<HTMLElement>
}) {
    const { address, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { src_xpower, tgt_xpower } = await contracts({
        token, src_version, tgt_version
    });
    if (!src_xpower) {
        throw new Error('undefined src_xpower');
    }
    if (!tgt_xpower) {
        throw new Error('undefined tgt_xpower');
    }
    //
    // Check allowance:
    //
    const src_allowance = await src_xpower.allowance(
        x40(address), tgt_xpower.address
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toString()
    );
    const src_balance = await src_xpower.balanceOf(
        x40(address)
    );
    if (src_allowance.eq(MAX_UINT256) || src_balance.isZero()) {
        alert(
            `Allowance has already been approved for; you can migrate now.`,
            Alert.info, { after: $approve.parent('div')[0] }
        );
        $migrate.prop('disabled', false);
        return;
    }
    //
    // Increase allowance:
    //
    let tx: Transaction | undefined;
    const reset = $approve.ing();
    Alerts.hide();
    try {
        src_xpower.on('Approval', (
            owner, spender, value, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Allowance has been approved for; you can migrate now.`,
                Alert.success, { after: $approve.parent('div')[0] }
            );
            $migrate.prop('disabled', false);
            reset();
        });
        tx = await src_xpower.approve(
            tgt_xpower.address, MAX_UINT256
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
$('button.moe-migrate').on(
    'click', async function migrateTokens(e) {
        const $migrate = $(e.currentTarget);
        if ($migrate.hasClass('thor')) {
            await moeMigrateOld(Token.THOR, { $migrate });
        }
        if ($migrate.hasClass('loki')) {
            await moeMigrateOld(Token.LOKI, { $migrate });
        }
        if ($migrate.hasClass('odin')) {
            await moeMigrateOld(Token.ODIN, { $migrate });
        }
    }
);
async function moeMigrateOld(token: Token, { $migrate }: {
    $migrate: JQuery<HTMLElement>
}) {
    const { address, src_version, tgt_version } = await context({
        $el: $migrate
    });
    const { src_xpower, tgt_xpower } = await contracts({
        token, src_version, tgt_version
    });
    if (!src_xpower) {
        throw new Error('undefined src_xpower');
    }
    if (!tgt_xpower) {
        throw new Error('undefined tgt_xpower');
    }
    //
    // Check allowance:
    //
    const src_balance = await src_xpower.balanceOf(
        x40(address)
    );
    console.debug(
        `[${src_version}:balance]`, src_balance.toString()
    );
    if (src_balance.isZero()) {
        alert(
            `Old balance is zero; nothing to migrate here.`,
            Alert.warning, { after: $migrate.parent('div')[0] }
        );
        return;
    }
    const src_allowance = await src_xpower.allowance(
        x40(address), tgt_xpower.address
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toString()
    );
    if (src_allowance.isZero()) {
        alert(
            `No allowance; did your allowance transaction confirm?`,
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
        src_xpower.on('Transfer', (
            from, to, amount, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Old ${Tokenizer.xify(token)} balance has been migrated! ;)`,
                Alert.success, { after: $migrate.parent('div')[0], id: 'success' }
            );
            reset();
        });
        const index = await tgt_xpower.oldIndexOf(src_xpower.address);
        tx = await tgt_xpower.migrate(src_balance, [index]);
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
    token, src_version, tgt_version
}: {
    token: Token, src_version: Version, tgt_version: Version
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
    let tgt_xpower: Contract | undefined;
    try {
        tgt_xpower = await XPowerMoeFactory({
            token, version: tgt_version
        }).connect();
        console.debug(
            `[${tgt_version}:tgt_xpower]`, tgt_xpower.address
        );
    } catch (ex) {
        console.error(ex);
    }
    return {
        src_xpower,
        tgt_xpower,
    };
}
