import { globalRef, nice, nice_si, x40 } from '../../source/functions';
import { Address, Amount } from '../../source/redux/types';
import { OtfWallet } from '../../source/wallet';

import React, {  } from 'react';
import { Avalanche } from '../../public/images/tsx';

type Props = {
    address: Address | null;
    amount: Amount | null;
} & {
    processing: boolean;
    onDeposit?: (processing: boolean) => void;
    onWithdraw?: (processing: boolean) => void;
} & {
    toggled: boolean;
}
export function UiOtfWallet(
    props: Props
) {
    const { toggled } = props;
    if (toggled) {
        return <div
            id='otf-wallet' ref={globalRef('#otf-wallet')}
        >
            <label className='form-label'>
                Minter Address and AVAX Balance
            </label>
            <div className='input-group otf-wallet-address'>
                {$transmitter(props)}
                {$address(props)}
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
    const { amount, processing } = props;
    const outer_classes = [
        'form-control input-group-text',
        processing ? 'processing' : '',
        direction({ amount }),
    ];
    const inner_classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start'
    ];
    return <button id='otf-wallet-transfer'
        className={outer_classes.join(' ')}
        data-bs-toggle='tooltip' data-bs-placement='top'
        onClick={transact.bind(null, props)}
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
function transact(
    { amount, processing, onDeposit, onWithdraw }: Props
) {
    if (amount !== null) {
        if (threshold_lte(amount)) {
            if (onWithdraw) {
                onWithdraw(processing);
            }
        } else {
            if (onDeposit) {
                onDeposit(processing);
            }
        }
    } else {
        if (onDeposit) {
            onDeposit(processing);
        }
    }
}
function $address(
    { address }: Pick<Props, 'address'>
) {
    return <input type='text' readOnly
        className='form-control' id='otf-wallet-address'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title='Minter address to pre-fund for transaction fees'
        value={x40(address ?? 0n)}
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
    return OtfWallet.threshold.lte(amount);
}
export default UiOtfWallet;