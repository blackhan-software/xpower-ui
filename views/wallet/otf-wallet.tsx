import { nice, nice_si, prompt, x40 } from '../../source/functions';
import { ROParams } from '../../source/params';
import { AccountContext, Button, Div, Input, Span, globalRef } from '../../source/react';
import { Account, Amount, OtfWallet } from '../../source/redux/types';
import { OtfManager } from '../../source/wallet';

import React, { useContext, useState } from 'react';
import { Avalanche } from '../../public/images/tsx';

import { useInterval } from 'usehooks-ts';
import { QRCode } from '../qr-code';
import { Sector } from './sector';


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
    return <Div
        id='otf-wallet' ref={globalRef('#otf-wallet')}
        className={!toggled ? 'd-none' : undefined}
    >
        <Div className='form-label'>
            Minter Address and AVAX Balance
        </Div>
        <Div className='input-group otf-wallet-address wallet-address'>
            {$transmitter(props)}
            {$qr_code(props)}
            {$account(props)}
            {$copy(props)}
            {$exportKey(props)}
            {$balance(props)}
            {$info()}
        </Div>
    </Div>;
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
    return <Button
        className={outer_classes.join(' ')}
        id='otf-wallet-transfer'
        onClick={transact.bind(null, { ...props, account })}
        title={title({ amount })}
    >
        <Span
            className={inner_classes.join(' ')} role='status'
        />
        <i className={icon({ amount })} />
    </Button>;
}
function $qr_code(
    { account }: Pick<Props, 'account'>
) {
    return <QRCode data={account ? x40(account) : ''} />;
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
        const Input = Number(avax.replace(/[']/g, ''));
        if (isNaN(Input) || Input === 0) {
            return;
        }
        const value = BigInt(Math.ceil(Input * 1e18));
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
    return <Input
        className='form-control'
        id='otf-wallet-address'
        readOnly
        title='Minter address to pre-fund for transaction fees'
        value={x40(account ?? 0n)}
    />;
}
function $copy(
    { account }: Pick<Props, 'account'>
) {
    return <Button
        className='form-control input-group-text'
        id='otf-wallet-copy'
        onClick={() => navigator.clipboard.writeText(x40(account!))}
        title='Copy address'
    >
        <i className='bi bi-copy'></i>
    </Button>;
}
function $exportKey(
    _: Props
) {
    const [percent, set_percent] = useState(0);
    const [delay, set_delay] = useState(0);
    useInterval(() => {
        if (percent >= 1) {
            const { privateKey } = OtfManager.signingKey();
            navigator.clipboard.writeText(privateKey);
        }
        if (percent < 1) {
            set_percent(percent + 0.0025);
        } else {
            set_percent(0);
            set_delay(0);
        }
    }, delay > 0 ? delay : null);
    return <Button
        className='form-control input-group-text'
        id='otf-wallet-export-key'
        onPointerDown={start_interval}
        onPointerUp={stop_interval}
        title='Export private key of address to clipboard'
    >
        <i className='bi bi-key'></i>
        {$sectors({ percent })}
    </Button>;
    function start_interval() {
        set_delay(1); // ms
    }
    function stop_interval() {
        set_percent(0);
        set_delay(0);
    }
}
function $sectors(
    { percent }: { percent: number }
) {
    return <Sector
        length={360 * percent} radius={16} start={0}
        stroke={{ dash: [1, 2], width: 4 }}
    />;
}
function $balance(
    { amount }: Pick<Props, 'amount'>
) {
    return <Input
        className='form-control'
        id='otf-wallet-balance'
        readOnly
        title={`${nice(amount ?? 0n, { base: 1e18 })} AVAX`}
        value={nice_si(amount ?? 0n, { base: 1e18 })}
    />;
}
function $info() {
    return <Button
        className='form-control input-group-text info'
        title='Balance of AVAX to auto-pay for transaction fees'
    >
        <Avalanche />
    </Button>;
}
function threshold_lte(amount: Amount) {
    return OtfManager.threshold < amount;
}
export default UiOtfWallet;
