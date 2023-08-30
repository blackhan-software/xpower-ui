/* eslint @typescript-eslint/no-explicit-any: [off] */
import './moe-migrate.scss';

import { Transaction } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { Alert, Alerts, alert, x40 } from '../../source/functions';
import { Account, MAX_UINT256, Token } from '../../source/redux/types';
import { Version } from '../../source/types';
import { MoeWallet } from '../../source/wallet';

Blockchain.onConnect(function enableAllowance() {
    const $approve = $('.approve-moe-allowance');
    $approve.prop('disabled', false);
});
$('button.approve-moe-allowance').on(
    'click', async function approveTokens(e) {
        const $approve = $(e.currentTarget);
        const $migrate = $approve.parents('form.moe-migrate');
        if ($approve.hasClass('xpow')) {
            await moeApproveOld({
                $approve, $migrate: $migrate.find(
                    '.moe-migrate.xpow'
                )
            });
        }
    }
);
async function moeApproveOld({ $approve, $migrate }: {
    $approve: JQuery<HTMLElement>, $migrate: JQuery<HTMLElement>
}) {
    const { account, src_version, tgt_version } = await context({
        $el: $approve
    });
    const { src_xpower, tgt_xpower } = await contracts({
        account, src_version, tgt_version
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
        x40(account), await tgt_xpower.address
    );
    console.debug(
        `[${src_version}:allowance]`, src_allowance.toString()
    );
    const src_balance = await src_xpower.balance;
    if (src_allowance === MAX_UINT256 || !src_balance) {
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
        src_xpower.onApproval((
            owner, spender, value, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
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
$('button.moe-migrate').on(
    'click', async function migrateTokens(e) {
        const $migrate = $(e.currentTarget);
        if ($migrate.hasClass('xpow')) {
            await moeMigrateOld({ $migrate });
        }
    }
);
async function moeMigrateOld({ $migrate }: {
    $migrate: JQuery<HTMLElement>
}) {
    const { account, src_version, tgt_version } = await context({
        $el: $migrate
    });
    const { src_xpower, tgt_xpower } = await contracts({
        account, src_version, tgt_version
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
    const src_balance = await src_xpower.balance;
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
    const src_allowance = await src_xpower.allowance(
        x40(account), await tgt_xpower.address
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
        src_xpower.onTransfer((
            from, to, amount, ev
        ) => {
            if (ev.log.transactionHash !== tx?.hash) {
                return;
            }
            alert(
                `Old ${Token.XPOW} balance has been migrated! ;)`,
                Alert.success, { after: $migrate.parent('div')[0], id: 'success' }
            );
            reset();
        });
        const index = await tgt_xpower.get.then(
            (c) => c.oldIndexOf(src_xpower.address)
        );
        tx = await tgt_xpower.put.then(
            (c) => c.migrate(src_balance, [index])
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
    return {
        src_xpower,
        tgt_xpower,
    };
}
