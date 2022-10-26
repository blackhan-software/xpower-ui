import { globalRef } from '../../../source/react';
import { Address, Amount, Nft, NftIssue, NftLevel, NftSenderStatus, Token } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { UiNftToggle } from './ui-toggle';

type Props = {
    token: Token;
    issue: NftIssue;
    level: NftLevel;
    amount: {
        value: Amount | null;
        valid: boolean | null;
    };
    target: {
        value: Address | null;
        valid: boolean | null;
    };
    status: NftSenderStatus | null;
    onTransfer?: (nft_issue: NftIssue, nft_level: NftLevel) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
}
export function UiNftSender(
    props: Props
) {
    const core_id = Nft.coreId({
        issue: props.issue, level: props.level
    });
    return <div
        className='btn-group nft-sender d-none d-sm-flex'
        ref={globalRef(`.nft-sender[core-id="${core_id}"]`)}
        role='group'
    >
        <UiNftToggle
            toggled={props.toggled}
            onToggled={props.onToggled}
        />
        {$button(props)}
        {$info(props)}
    </div>;
}
function $button(
    props: Props
) {
    return <button type='button'
        className='btn btn-outline-warning sender'
        disabled={disabled(props)}
        onClick={props.onTransfer?.bind(
            null, props.issue, props.level
        )}
    >
        {Spinner({
            show: props.status === NftSenderStatus.sending, grow: true
        })}
        <span className='text'>{text(props)}</span>
    </button>;
}
function text(
    { level, status }: Props
) {
    return status === NftSenderStatus.sending
        ? `Sending ${Nft.nameOf(level)} NFTs…`
        : `Send ${Nft.nameOf(level)} NFTs`;
}
function disabled(
    { amount, status, target }: Props
) {
    if (status === NftSenderStatus.sending) {
        return true;
    }
    if (target.valid !== true) {
        return true;
    }
    if (amount.valid !== true) {
        return true;
    }
    return false;
}
function $info(
    { issue, level }: Props
) {
    return <button type='button'
        className='btn btn-outline-warning info'
        data-bs-placement='top' data-bs-toggle='tooltip'
        title={`Send ${Nft.nameOf(level)} NFTs to destination (for ${issue})`}
    >
        <InfoCircle fill={true} />
    </button>;
}
function Spinner(
    { show, grow }: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow ? 'spinner-grow' : ''
    ];
    return <span
        className={classes.join(' ')} role='status'
        style={{ visibility: show ? 'visible' : 'hidden' }}
    />;
}
export default UiNftSender;
