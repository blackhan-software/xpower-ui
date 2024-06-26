import { Blockchain } from '../../../source/blockchain';
import { x40 } from '../../../source/functions';
import { Account, Amount, Nft, NftIssue, NftLevel } from '../../../source/redux/types';

import React, { ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { Div, Input, Span } from '../../../source/react';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    balance: Amount;
    value: Account | null;
    valid: boolean | null;
    onTargetChanged: (
        value: Account | null,
        valid: boolean | null
    ) => void;
}
export function UiNftTarget(
    props: Props
) {
    const $ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if ($ref.current && props.value !== null) {
            $ref.current.value = props.balance ? x40(props.value) : '';
        }
    }, [
        props.balance, props.value
    ]);
    const classes = [
        'form-control', validity(props)
    ];
    return <React.Fragment>
        <Div className='form-label nft-transfer-to-label d-none d-sm-flex'>
            Send To
        </Div>
        <Div className='input-group nft-transfer-to d-none d-sm-flex' role='group'>
            <Input ref={$ref}
                className={classes.join(' ')}
                disabled={!props.balance} placeholder='0x…'
                onChange={onChange.bind(null, props)}
                onInput={onChange.bind(null, props)}
                style={{ cursor: cursor(props) }}
                name={`nft-transfer-to-${props.level}-${props.issue}`}
            />
            <Span className='input-group-text info' title={title(props)}>
                <InfoCircle fill={true} />
            </Span>
        </Div>
    </React.Fragment>;
}
function cursor(
    props: Props
) {
    return props.balance ? 'text' : 'not-allowed';
}
function validity(
    props: Props
) {
    if (props.balance && props.valid === true) {
        return 'is-valid';
    }
    if (props.balance && props.valid === false) {
        return 'is-invalid';
    }
    return '';
}
async function onChange(
    props: Props, e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>
) {
    if (typeof props.onTargetChanged !== 'function') {
        return;
    }
    const account = await Blockchain.account;
    if (!account) {
        throw new Error('missing account');
    }
    const $target = e.target as HTMLInputElement;
    if (!$target.value) {
        props.onTargetChanged(null, null);
        return;
    }
    if (!isAddress($target.value)) {
        props.onTargetChanged(null, false);
        return;
    }
    if (isZeroAddress($target.value) ||
        isSameAccount($target.value, account)
    ) {
        const value = BigInt($target.value);
        props.onTargetChanged(value, false);
        return;
    }
    const value = BigInt($target.value);
    props.onTargetChanged(value, true);
}
function isAddress(value: string) {
    return value.match(/^0x([0-9a-f]{40}$)/i);
}
function isZeroAddress(value: string) {
    return value.match(new RegExp(`^${x40(0n)}$`, 'i'));
}
function isSameAccount(value: string, account: Account) {
    return value.match(new RegExp(`^${x40(account)}$`, 'i'));
}
function title(
    { level }: Props
) {
    return `Address to send minted ${Nft.nameOf(level)} NFTs to`;
}
export default UiNftTarget;
