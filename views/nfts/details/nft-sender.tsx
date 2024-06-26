import { Account, Amount, Nft, NftIssue, NftLevel, NftSenderStatus } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { Button, Div, Span, globalRef } from '../../../source/react';
import { UiNftToggle } from './ui-toggle';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    amount: {
        value: Amount | null;
        valid: boolean | null;
    };
    target: {
        value: Account | null;
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
    const full_id = Nft.fullId({
        issue: props.issue,
        level: props.level
    });
    return <Div
        className='btn-group nft-sender d-none d-sm-flex'
        ref={globalRef(`.nft-sender[full-id="${full_id}"]`)}
        role='group'
    >
        <UiNftToggle
            toggled={props.toggled}
            onToggled={props.onToggled}
        />
        {$button(props)}
        {$info(props)}
    </Div>;
}
function $button(
    props: Props
) {
    return <Button
        className='btn btn-outline-warning sender'
        disabled={disabled(props)}
        onClick={props.onTransfer?.bind(
            null, props.issue, props.level
        )}
    >
        {Spinner({
            show: props.status === NftSenderStatus.sending, grow: true
        })}
        <Span className='text'>{text(props)}</Span>
    </Button>;
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
    return <Button
        className='btn btn-outline-warning info' title={
            `Send ${Nft.nameOf(level)} NFTs to destination (for ${issue})`
        }
    >
        <InfoCircle fill={true} />
    </Button>;
}
function Spinner(
    { show, grow }: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow ? 'spinner-grow' : ''
    ];
    return <Span
        className={classes.join(' ')} role='status'
        style={{ display: show ? 'inline-block' : 'none' }}
    />;
}
export default UiNftSender;
