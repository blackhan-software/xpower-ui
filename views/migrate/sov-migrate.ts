/* eslint @typescript-eslint/no-explicit-any: [off] */
import './sov-migrate.scss';

import { Transaction } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { Alert, Alerts, alert, x40 } from '../../source/functions';
import { Account, MAX_UINT256, Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { Version } from '../../source/types';
import { MoeWallet, SovWallet } from '../../source/wallet';

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
            await moeApproveOld(Token.THOR, {
                $approve
            });
            await moeApproveNew(Token.THOR, {
                $approve
            });
            await sovApproveOld(Token.THOR, {
                $approve, $migrate: $migrate.find(
                    '.sov-migrate.thor'
                )
            });
        }
        if ($approve.hasClass('loki')) {
            await moeApproveOld(Token.LOKI, {
                $approve
            });
            await moeApproveNew(Token.LOKI, {
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
    const { account, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { src_xpower, src_apower, tgt_xpower } = await contracts({
        account, token, src_version, tgt_version
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
        x40(account), await tgt_xpower.address
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toString()
    );
    const src_balance = await src_apower.balance;
    if (src_allowance === MAX_UINT256 || !src_balance) {
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
async function moeApproveNew(token: Token, { $approve }: {
    $approve: JQuery<HTMLElement>
}) {
    const { account, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { src_apower, tgt_xpower, tgt_apower } = await contracts({
        account, token, src_version, tgt_version
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
        x40(account), await tgt_apower.address
    );
    console.debug(
        `[${tgt_version}:allowance]`, tgt_allowance.toString()
    );
    const src_balance = await src_apower.balance;
    if (tgt_allowance === MAX_UINT256 || !src_balance) {
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
            await tgt_apower.address, MAX_UINT256
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
    const { account, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { src_apower, tgt_apower } = await contracts({
        account, token, src_version, tgt_version
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
        x40(account), await tgt_apower.address
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toString()
    );
    const src_balance = await src_apower.balance;
    if (src_allowance === MAX_UINT256 || !src_balance) {
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
        src_apower.onApproval((
            owner, spender, value, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
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
            await tgt_apower.address, MAX_UINT256
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
    const { account, src_version, tgt_version } = await context({
        $el: $migrate
    });
    const {
        src_apower, tgt_apower,
        src_xpower, tgt_xpower,
    } = await contracts({
        account, token, src_version, tgt_version
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
    // Check balance (of MOE):
    //
    const moe_balance = await src_xpower.balance;
    console.debug(
        `[${src_version}:balance]`, moe_balance.toString(), `[${token}]`
    );
    if (moe_balance) {
        alert(
            `Old ${token} balance is non-zero; migrate them first.`,
            Alert.warning, { after: $migrate.parent('div')[0] }
        );
        return;
    }
    //
    // Check allowance:
    //
    const src_balance = await src_apower.balance;
    console.debug(
        `[${src_version}:balance]`, src_balance.toString()
    );
    if (!src_balance) {
        alert(
            `Old balance is zero; nothing to migrate here.`,
            Alert.warning, { after: $migrate.parent('div')[0] }
        );
        return;
    }
    const src_allowance = await src_apower.allowance(
        x40(account), await tgt_apower.address
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toString()
    );
    if (!src_allowance) {
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
        tgt_apower.onTransfer((
            from, to, amount, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Old ${Tokenizer.aify(token)} balance has been migrated! ;)`,
                Alert.success, { after: $migrate.parent('div')[0], id: 'success' }
            );
            reset();
        });
        const sov_index = await tgt_apower.get.then(
            (c) => c.oldIndexOf(src_apower.address)
        );
        const moe_index = await tgt_xpower.get.then(
            (c) => c.oldIndexOf(src_xpower.address)
        );
        tx = await tgt_apower.put.then(
            (c) => c.migrate(src_balance, [sov_index, moe_index])
        );
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
    account, token, src_version, tgt_version
}: {
    account: Account, token: Token, src_version: Version, tgt_version: Version
}) {
    let src_xpower: MoeWallet | undefined;
    try {
        src_xpower = new MoeWallet(
            account, token, src_version
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
            account, token, tgt_version
        );
        console.debug(
            `[${tgt_version}:tgt_xpower]`, await tgt_xpower.address
        );
    } catch (ex) {
        console.error(ex);
    }
    let src_apower: SovWallet | undefined;
    try {
        src_apower = new SovWallet(
            account, token, src_version
        );
        console.debug(
            `[${src_version}:src_apower]`, await src_apower.address
        );
    } catch (ex) {
        console.error(ex);
    }
    let tgt_apower: SovWallet | undefined;
    try {
        tgt_apower = new SovWallet(
            account, token, tgt_version
        );
        console.debug(
            `[${tgt_version}:tgt_apower]`, await tgt_apower.address
        );
    } catch (ex) {
        console.error(ex);
    }
    return {
        src_xpower, src_apower,
        tgt_xpower, tgt_apower,
    };
}
