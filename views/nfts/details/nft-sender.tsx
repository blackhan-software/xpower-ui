import { Referable } from '../../../source/functions';
import { Address, Amount, Token } from '../../../source/redux/types';
import { Nft, NftIssue, NftLevel } from '../../../source/redux/types';
import { NftSenderStatus } from '../../../source/redux/types';

import React from 'react';
import { UiNftToggle } from './ui-toggle';
import { InfoCircle } from '../../../public/images/tsx';

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
export class UiNftSender extends Referable(React.Component)<
    Props
> {
    render() {
        const { level, issue } = this.props;
        return this.$sender(issue, level);
    }
    $sender(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const core_id = Nft.coreId({
            issue: nft_issue, level: nft_level
        });
        return <div
            className='btn-group nft-sender d-none d-sm-flex'
            ref={this.globalRef(`.nft-sender[core-id="${core_id}"]`)}
            role='group'
        >
            <UiNftToggle
                toggled={this.props.toggled}
                onToggled={this.props.onToggled?.bind(this)}
            />
            {this.$button(nft_issue, nft_level)}
            {this.$info(nft_issue, nft_level)}
        </div>;
    }
    $button(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const { status: status } = this.props;
        return <button type='button'
            className='btn btn-outline-warning sender'
            disabled={this.disabled}
            onClick={this.props.onTransfer?.bind(
                this, nft_issue, nft_level
            )}
        >
            {Spinner({
                show: status === NftSenderStatus.sending, grow: true
            })}
            <span className='text'>
                {this.text}
            </span>
        </button>;
    }
    get text() {
        const { level } = this.props;
        const { status: status } = this.props;
        return status === NftSenderStatus.sending
            ? `Sending ${Nft.nameOf(level)} NFTs…`
            : `Send ${Nft.nameOf(level)} NFTs`;
    }
    get disabled() {
        const { status } = this.props;
        if (status === NftSenderStatus.sending) {
            return true;
        }
        const { target } = this.props;
        if (target.valid !== true) {
            return true;
        }
        const { amount } = this.props;
        if (amount.valid !== true) {
            return true;
        }
        return false;
    }
    $info(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        return <button type='button'
            className='btn btn-outline-warning info'
            data-bs-placement='top' data-bs-toggle='tooltip'
            title={`Send ${Nft.nameOf(nft_level)} NFTs to destination (for ${nft_issue})`}
        >
            <InfoCircle fill={true} />
        </button>;
    }
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
