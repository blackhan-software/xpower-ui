import { nice, nice_si, prompt, x40 } from '../../source/functions';
import { ROParams } from '../../source/params';
import { AccountContext, globalRef } from '../../source/react';
import { Account, Amount, OtfWallet } from '../../source/redux/types';
import { OtfManager } from '../../source/wallet';

import React, { useContext } from 'react';
import { Avalanche } from '../../public/images/tsx';

type Props = OtfWallet & {
    onDeposit?: (
        processing: OtfWallet['processing'],
        amount: OtfWallet['amount']
    ) => void;
    onWithdraw?: (
        processing: OtfWallet['processing']
    ) => void;
}
export function UiOtfWallet(
    props: Props
) {
    const { toggled } = props;
    if (toggled) {
        return <div
            id='otf-wallet' ref={globalRef('#otf-wallet')}
        >
            <div className='form-label'>
                Minter Address and AVAX Balance
            </div>
            <div className='input-group otf-wallet-address'>
                {$transmitter(props)}
                {$account(props)}
                {$balance(props)}
                {$info()}
            </div>
        </div>;
    }
    return null;
}
function $transmitter(
    props: Props
) {
    const [account] = useContext(AccountContext);
    const { amount, processing } = props;
    const outer_classes = [
        'form-control input-group-text',
        processing ? 'processing' : '',
        direction({ amount }),
    ];
    const inner_classes = [
        'spinner spinner-border spinner-border-sm', 'float-start'
    ];
    return <button
        className={outer_classes.join(' ')}
        data-bs-toggle='tooltip' data-bs-placement='top'
        id='otf-wallet-transfer'
        onClick={transact.bind(null, { ...props, account })}
        title={title({ amount })}
    >
        <span
            className={inner_classes.join(' ')} role='status'
        />
        <i className={icon({ amount })} />
    </button>;
}
function direction(
    { amount }: Pick<Props, 'amount'>
) {
    if (amount !== null) {
        if (threshold_lte(amount)) {
            return 'withdraw';
        }
    }
    return 'deposit';
}
function icon(
    { amount }: Pick<Props, 'amount'>
) {
    if (amount !== null) {
        if (threshold_lte(amount)) {
            return 'bi-dash-circle';
        }
        return 'bi-plus-circle';
    }
    return 'bi-circle';
}
function title(
    { amount }: Pick<Props, 'amount'>
) {
    if (amount !== null) {
        if (threshold_lte(amount)) {
            return 'Withdraw AVAX from minter to wallet address';
        }
    }
    return 'Deposit AVAX from wallet to minter address';
}
async function transact(
    { amount, processing, onDeposit, onWithdraw, account }: Props & {
        account: Account | null
    }
) {
    if (amount !== null) {
        if (threshold_lte(amount)) {
            if (onWithdraw) {
                onWithdraw(processing);
            }
            return;
        }
    }
    if (onDeposit) {
        const info = warning(account);
        const prefix = info.warn ?
            "The minter wallet's secret is stored in a cookie. So, you *will* " +
            "loose your transferred AVAX if you delete your cookies! 💀\n\n" : "";
        const avax = await prompt(
            prefix + "Really? Confirm the amount of AVAX to transfer: 💸", "1.0"
        );
        if (typeof avax !== 'string') {
            return;
        }
        const input = Number(avax.replace(/[']/g, ''));
        if (isNaN(input) || input === 0) {
            return;
        }
        const value = BigInt(Math.ceil(input * 1e18));
        if (value) {
            onDeposit(processing, value);
        }
        if (info.warn) {
            persist(info);
        }
    }
    function warning(
        account: Account | null,
        max_time = 8.64e7, // daily
        key = 'oft-wallet:deposit:warn',
    ) {
        if (account) {
            key += ':' + account;
        }
        const now_date = new Date();
        const old_date = new Date(localStorage.getItem(key) ?? 0);
        const dif_time = now_date.getTime() - old_date.getTime();
        const warn = !!ROParams.debug || dif_time > max_time;
        return { warn, key, date: now_date };
    }
    function persist(
        { warn, key, date }: { warn: boolean, key: string, date: Date }
    ) {
        if (warn) {
            localStorage.setItem(key, date.toISOString());
        }
        return { warn, key, date };
    }
}
function $account(
    { account }: Pick<Props, 'account'>
) {
    return <input type='text' readOnly
        className='form-control' id='otf-wallet-address'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title='Minter address to pre-fund for transaction fees'
        value={x40(account ?? 0n)}
    />;
}
function $balance(
    { amount }: Pick<Props, 'amount'>
) {
    return <input type='text' readOnly
        className='form-control' id='otf-wallet-balance'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title={`${nice(amount ?? 0n, { base: 1e18 })} AVAX`}
        value={nice_si(amount ?? 0n, { base: 1e18 })}
    />;
}
function $info() {
    return <button
        className='form-control input-group-text info'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title='Balance of AVAX to auto-pay for transaction fees'
    >
        <Avalanche />
    </button>;
}
function threshold_lte(amount: Amount) {
    return OtfManager.threshold < amount;
}
export default UiOtfWallet;
