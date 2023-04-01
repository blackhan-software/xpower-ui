/* eslint @typescript-eslint/no-explicit-any: [off] */
import './sov-migrate.scss';

import { Contract, Transaction } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { XPowerMoeFactory, XPowerSovFactory } from '../../source/contract';
import { Alert, alert, Alerts, x40 } from '../../source/functions';
import { MAX_UINT256, Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { Version } from '../../source/types';

Blockchain.onConnect(function enableAllowance() {
    const $approve = $('.approve-sov-allowance').filter((i, el) => {
        const source = new RegExp($(el).data('source'));
        return 'v2a|v2b|v2c|v3a|v3b|v4a'.match(source) === null;
    });
    $approve.prop('disabled', false);
});
$('button.approve-sov-allowance').on(
    'click', async function approveTokens(e) {
        const $approve = $(e.currentTarget);
        const $migrate = $approve.parents('form.sov-migrate');
        if ($approve.hasClass('thor')) {
            await moeApproveNew(Token.THOR, {
                $approve
            });
            await moeApproveOld(Token.THOR, {
                $approve
            });
            await sovApproveOld(Token.THOR, {
                $approve, $migrate: $migrate.find(
                    '.sov-migrate.thor'
                )
            });
        }
        if ($approve.hasClass('loki')) {
            await moeApproveNew(Token.LOKI, {
                $approve
            });
            await moeApproveOld(Token.LOKI, {
                $approve
            });
            await sovApproveOld(Token.LOKI, {
                $approve, $migrate: $migrate.find(
                    '.sov-migrate.loki'
                )
            });
        }
        if ($approve.hasClass('odin')) {
            await moeApproveNew(Token.ODIN, {
                $approve
            });
            await moeApproveOld(Token.ODIN, {
                $approve
            });
            await sovApproveOld(Token.ODIN, {
                $approve, $migrate: $migrate.find(
                    '.sov-migrate.odin'
                )
            });
        }
    }
);
async function moeApproveOld(token: Token, { $approve }: {
    $approve: JQuery<HTMLElement>
}) {
    const { address, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { src_xpower, src_apower, tgt_xpower } = await contracts({
        token, src_version, tgt_version
    });
    if (!src_xpower) {
        throw new Error('undefined src_xpower');
    }
    if (!src_apower) {
        throw new Error('undefined src_apower');
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
    const src_balance = await src_apower.balanceOf(
        x40(address)
    );
    if (src_allowance.eq(MAX_UINT256) || src_balance.isZero()) {
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
async function moeApproveNew(token: Token, { $approve }: {
    $approve: JQuery<HTMLElement>
}) {
    const { address, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { src_apower, tgt_xpower, tgt_apower } = await contracts({
        token, src_version, tgt_version
    });
    if (!src_apower) {
        throw new Error('undefined src_apower');
    }
    if (!tgt_xpower) {
        throw new Error('undefined tgt_xpower');
    }
    if (!tgt_apower) {
        throw new Error('undefined tgt_apower');
    }
    //
    // Check allowance:
    //
    const tgt_allowance = await tgt_xpower.allowance(
        x40(address), tgt_apower.address
    );
    console.debug(
        `[${tgt_version}:allowance]`, tgt_allowance.toString()
    );
    const src_balance = await src_apower.balanceOf(
        x40(address)
    );
    if (tgt_allowance.eq(MAX_UINT256) || src_balance.isZero()) {
        return;
    }
    //
    // Increase allowance:
    //
    let tx: Transaction | undefined;
    const reset = $approve.ing();
    Alerts.hide();
    try {
        tgt_xpower.on('Approval', (
            owner, spender, value, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            reset();
        });
        tx = await tgt_xpower.approve(
            tgt_apower.address, MAX_UINT256
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
async function sovApproveOld(token: Token, { $approve, $migrate }: {
    $approve: JQuery<HTMLElement>, $migrate: JQuery<HTMLElement>
}) {
    const { address, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { src_apower, tgt_apower } = await contracts({
        token, src_version, tgt_version
    });
    if (!src_apower) {
        throw new Error('undefined src_apower');
    }
    if (!tgt_apower) {
        throw new Error('undefined tgt_apower');
    }
    //
    // Check allowance:
    //
    const src_allowance = await src_apower.allowance(
        x40(address), tgt_apower.address
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toString()
    );
    const src_balance = await src_apower.balanceOf(
        x40(address)
    );
    if (src_allowance.eq(MAX_UINT256) || src_balance.isZero()) {
        alert(
            `Allowance(s) have already been approved for; you can migrate now.`,
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
        src_apower.on('Approval', (
            owner, spender, value, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Allowance(s) have been approved for; you can migrate now.`,
                Alert.success, { after: $approve.parent('div')[0] }
            );
            $migrate.prop('disabled', false);
            reset();
        });
        tx = await src_apower.approve(
            tgt_apower.address, MAX_UINT256
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
$('button.sov-migrate').on(
    'click', async function migrateTokens(e) {
        const $migrate = $(e.currentTarget);
        if ($migrate.hasClass('thor')) {
            await sovMigrateOld(Token.THOR, { $migrate });
        }
        if ($migrate.hasClass('loki')) {
            await sovMigrateOld(Token.LOKI, { $migrate });
        }
        if ($migrate.hasClass('odin')) {
            await sovMigrateOld(Token.ODIN, { $migrate });
        }
    }
);
async function sovMigrateOld(token: Token, { $migrate }: {
    $migrate: JQuery<HTMLElement>
}) {
    const { address, src_version, tgt_version } = await context({
        $el: $migrate
    });
    const {
        src_apower, tgt_apower,
        src_xpower, tgt_xpower,
    } = await contracts({
        token, src_version, tgt_version
    });
    if (!src_apower) {
        throw new Error('undefined src_apower');
    }
    if (!tgt_apower) {
        throw new Error('undefined tgt_apower');
    }
    if (!src_xpower) {
        throw new Error('undefined src_xpower');
    }
    if (!tgt_xpower) {
        throw new Error('undefined tgt_xpower');
    }
    //
    // Check allowance:
    //
    const src_balance = await src_apower.balanceOf(
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
    const src_allowance = await src_apower.allowance(
        x40(address), tgt_apower.address
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
        tgt_apower.on('Transfer', (
            from, to, amount, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Old ${Tokenizer.aify(token)} balance has been migrated! ;)`,
                Alert.success, { after: $migrate.parent('div')[0], id: 'success' }
            );
            reset();
        });
        const sov_index = await tgt_apower.oldIndexOf(src_apower.address);
        const moe_index = await tgt_xpower.oldIndexOf(src_xpower.address);
        tx = await tgt_apower.migrate(src_balance, [sov_index, moe_index]);
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
    let src_apower: Contract | undefined;
    try {
        src_apower = await XPowerSovFactory({
            token, version: src_version
        }).connect();
        console.debug(
            `[${src_version}:src_apower]`, src_apower.address
        );
    } catch (ex) {
        console.error(ex);
    }
    let tgt_apower: Contract | undefined;
    try {
        tgt_apower = await XPowerSovFactory({
            token, version: tgt_version
        }).connect();
        console.debug(
            `[${tgt_version}:tgt_apower]`, tgt_apower.address
        );
    } catch (ex) {
        console.error(ex);
    }
    return {
        src_xpower, src_apower,
        tgt_xpower, tgt_apower,
    };
}
