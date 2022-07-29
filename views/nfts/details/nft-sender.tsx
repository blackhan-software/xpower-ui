/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Blockchain } from '../../../source/blockchain';
import { Transaction } from 'ethers';
import { Alerts, Alert, alert, ancestor } from '../../../source/functions';
import { Referable } from '../../../source/functions';
import { Address, Amount, Token } from '../../../source/redux/types';
import { Nft, NftFullId, NftIssue, NftLevel } from '../../../source/redux/types';
import { NftWallet } from '../../../source/wallet';
import { OnTransferSingle } from '../../../source/wallet';

import React from 'react';
import { NftUiToggle } from './ui-toggle';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    token: Token;
    issue: NftIssue;
    level: NftLevel;
    target: {
        value: Address | null;
        valid: boolean | null;
    };
    amount: {
        value: Amount | null;
        valid: boolean | null;
    };
    onSending?: (
        from: Address, to: Address,
        id: NftFullId, amount: Amount
    ) => void;
    onSent?: (
        from: Address, to: Address,
        id: NftFullId, amount: Amount
    ) => void;
    onError?(): void;
    toggled: boolean;
    onToggle: (toggled: boolean) => void;
}
type State = {
    status: Status | null;
}
enum Status {
    sending = 'sending',
    sent = 'sent',
    error = 'error'
}
export class NftSender extends Referable(React.Component)<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            status: null
        };
    }
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
        return <div role='group' ref={this.ref(core_id)}
            className='btn-group nft-sender d-none d-sm-flex'
            data-id={core_id} data-level={Nft.nameOf(nft_level)}
        >
            <NftUiToggle
                toggled={this.props.toggled}
                onToggle={this.props.onToggle}
            />
            {this.$button(nft_issue, nft_level)}
            {this.$info(nft_issue, nft_level)}
        </div>;
    }
    $button(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const { status } = this.state;
        return <button type='button'
            className='btn btn-outline-warning sender'
            data-state={status} disabled={this.disabled}
            onClick={this.transfer.bind(this, nft_issue, nft_level)}
        >
            {Spinner({
                show: status === Status.sending, grow: true
            })}
            <span className='text'>
                {this.text}
            </span>
        </button>;
    }
    get text() {
        const { level } = this.props;
        const { status } = this.state;
        return status === Status.sending
            ? `Sending ${Nft.nameOf(level)} NFTs…`
            : `Send ${Nft.nameOf(level)} NFTs`;
    }
    get disabled() {
        const { target } = this.props;
        if (target.valid !== true) {
            return true;
        }
        const { amount } = this.props;
        if (amount.valid !== true) {
            return true;
        }
        const { status } = this.state;
        if (status === Status.sending) {
            return true;
        }
        return false;
    }
    async transfer(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        const nft_token = Nft.token(
            this.props.token
        );
        const core_id = Nft.coreId({
            issue: nft_issue, level: nft_level
        });
        const full_id = Nft.fullId({
            issue: nft_issue, level: nft_level,
            token: nft_token
        });
        const target = this.props.target.value as Address;
        const amount = this.props.amount.value as Amount;
        const nft_wallet = new NftWallet(
            address, this.props.token
        );
        const on_single_tx: OnTransferSingle = async (
            op, from, to, id, value, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            this.setState({
                status: Status.sent
            }, () => {
                const { onSent } = this.props;
                if (onSent) onSent(
                    BigInt(from), BigInt(to),
                    full_id, value
                );
            });
        };
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.setState({
                status: Status.sending
            }, () => {
                const { onSending } = this.props;
                if (onSending) onSending(
                    address, target,
                    full_id, amount
                );
            });
            nft_wallet.onTransferSingle(on_single_tx);
            tx = await nft_wallet.safeTransfer(
                target, core_id, amount
            );
        } catch (ex: any) {
            /* eslint no-ex-assign: [off] */
            if (ex.error) {
                ex = ex.error;
            }
            if (ex.message) {
                if (ex.data && ex.data.message) {
                    ex.message = `${ex.message} [${ex.data.message}]`;
                }
                const $sender_row = ancestor(
                    this.ref<HTMLElement>(core_id).current,
                    (e) => e.classList.contains('row')
                );
                alert(ex.message, Alert.warning, {
                    style: { margin: '0.5em 0 -0.5em 0' },
                    after: $sender_row
                });
            }
            this.setState(
                { status: Status.error },
                this.props.onError
            );
            console.error(ex);
        }
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
export default NftSender;
