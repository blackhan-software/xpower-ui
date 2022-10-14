import { Blockchain } from '../../../source/blockchain';
import { x40 } from '../../../source/functions';
import { Address, Amount, Nft, NftIssue, NftLevel } from '../../../source/redux/types';

import React, { ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    balance: Amount;
    value: Address | null;
    valid: boolean | null;
    onTargetChanged: (
        value: Address | null,
        valid: boolean | null
    ) => void;
}
export function UiNftTarget(
    props: Props
) {
    const $ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if ($ref.current && props.value !== null) {
            $ref.current.value = x40(props.value);
        }
    }, [props.value]);
    const classes = [
        'form-control', validity(props)
    ];
    return <React.Fragment>
        <label className='form-label nft-transfer-to-label d-none d-sm-flex'>
            Send To
        </label>
        <div className='input-group nft-transfer-to d-none d-sm-flex'
            role='group'
        >
            <input type='text' ref={$ref}
                className={classes.join(' ')}
                disabled={!props.balance} placeholder='0x…'
                onChange={onChange.bind(null, props)}
                onInput={onChange.bind(null, props)}
                style={{ cursor: cursor(props) }}
            />
            <span className='input-group-text info'
                data-bs-placement='top' data-bs-toggle='tooltip'
                title={title(props)}
            >
                <InfoCircle fill={true} />
            </span>
        </div>
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
    if (props.valid === true) {
        return 'is-valid';
    }
    if (props.valid === false) {
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
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const $target = e.target as HTMLInputElement;
    let value: Amount | null;
    try {
        if ($target.value.match(/^0x([0-9a-f]{40})/i) !== null) {
            value = BigInt($target.value);
        } else {
            value = 0n;
        }
    } catch (ex) {
        value = null;
    }
    if (value === null || !$target.value) {
        props.onTargetChanged(value, null);
    } else if (
        isAddress($target.value) &&
        !isZeroAddress($target.value) &&
        !isSameAddress($target.value, address)
    ) {
        props.onTargetChanged(value, true);
    } else {
        props.onTargetChanged(value, false);
    }
}
function isAddress(value: string) {
    return value.match(/^0x([0-9a-f]{40}$)/i);
}
function isZeroAddress(value: string) {
    return value.match(new RegExp(`^${x40(0n)}$`, 'i'));
}
function isSameAddress(value: string, address: Address) {
    return value.match(new RegExp(`^${x40(address)}$`, 'i'));
}
function title(
    props: Props
) {
    return `Address to send minted ${Nft.nameOf(props.level)} NFTs to (for ${props.issue})`;
}
export default UiNftTarget;
