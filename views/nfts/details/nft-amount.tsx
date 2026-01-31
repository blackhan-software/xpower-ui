import { Amount, Nft, NftIssue, NftLevel } from '../../../source/redux/types';
import { Div, Input, Span } from '../../../source/react';

import React, { ChangeEvent, FormEvent } from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    balance: Amount;
    value: Amount | null;
    valid: boolean | null;
    onAmountChanged: (
        value: Amount | null,
        valid: boolean | null
    ) => void;
}
export function UiNftAmount(
    props: Props
) {
    return $amount(props);
}
function $amount(
    props: Props
) {
    const classes = [
        'form-control', validity(props)
    ];
    return <>
        <Div className='form-label nft-transfer-amount-label d-none d-sm-flex'>
            Send Amount
        </Div>
        <Div className='input-group nft-transfer-amount d-none d-sm-flex' role='group'>
            <Input type='number'
                className={classes.join(' ')}
                disabled={!props.balance} min='0' placeholder='0'
                name={`nft-transfer-amount-${props.level}-${props.issue}`}
                onChange={onChange.bind(null, props)}
                onInput={onChange.bind(null, props)}
                style={{ cursor: cursor(props) }}
                value={typeof props.value === 'bigint' ? props.value.toString() : ''}
            />
            <Span className='input-group-text info' title={title(props)}>
                <InfoCircle fill={true} />
            </Span>
        </Div>
    </>;
}
function cursor(
    props: Props
) {
    return props.balance ? 'text' : 'not-allowed'
}
function validity(
    props: Props
) {
    if (props.valid === true) {
        return 'is-valid';
    }
    if (props.valid === false) {
        return 'is-invalid';
    }
    return '';
}
function onChange(
    props: Props, e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>
) {
    if (typeof props.onAmountChanged !== 'function') {
        return;
    }
    const $target = e.target as HTMLInputElement;
    let value: Amount | null;
    try {
        if ($target.value.match(/0x/i) === null) {
            value = BigInt($target.value);
        } else {
            value = 0n;
        }
    } catch (e) {
        console.debug(e);
        value = null;
    }
    if (value === null || !$target.value) {
        props.onAmountChanged(value, null);
    } else if (
        value > 0 && value <= props.balance
    ) {
        props.onAmountChanged(value, true);
    } else {
        props.onAmountChanged(value, false);
    }
}
function title(
    { level }: Props
) {
    return `Amount of minted ${Nft.nameOf(level)} NFTs to send`;
}
export default UiNftAmount;
