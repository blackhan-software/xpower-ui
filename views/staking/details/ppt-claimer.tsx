/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Blockchain } from '../../../source/blockchain';
import { MoeTreasuryFactory, OnClaim } from '../../../source/contract';
import { Transaction } from 'ethers';
import { Alert, Alerts, alert } from '../../../source/functions';
import { Referable, ancestor, x40 } from '../../../source/functions';
import { Address, Amount, Token } from '../../../source/redux/types';
import { Nft, NftFullId, NftIssue, NftLevel } from '../../../source/redux/types';
import { OtfWallet } from '../../../source/wallet';

import React from 'react';
import { NftUiToggle } from './ui-toggle';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    token: Token;
    issue: NftIssue;
    level: NftLevel;
    claimable: Amount;
    onClaiming?: (
        from: Address, id: NftFullId, amount: Amount
    ) => void;
    onClaimed?: (
        from: Address, id: NftFullId, amount: Amount
    ) => void;
    onError?(): void;
    toggled: boolean;
    onToggle: (toggled: boolean) => void;
}
type State = {
    status: Status | null;
}
enum Status {
    claiming = 'claiming',
    claimed = 'claimed',
    error = 'error'
}
export class PptClaimer extends Referable(React.Component)<
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
        return this.$claimer(issue, level);
    }
    $claimer(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const core_id = Nft.coreId({
            issue: nft_issue, level: nft_level
        });
        return <div role='group' ref={this.ref(core_id)}
            className='btn-group nft-claimer d-none d-sm-flex'
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
            className='btn btn-outline-warning claimer'
            data-state={status} disabled={this.disabled}
            onClick={this.claim.bind(this, nft_issue, nft_level)}
        >
            {Spinner({
                show: status === Status.claiming, grow: true
            })}
            <span className='text'>
                {this.text}
            </span>
        </button>;
    }
    get text() {
        const { status } = this.state;
        return status === Status.claiming
            ? 'Claiming Rewards…'
            : 'Claim Rewards';
    }
    get disabled() {
        const { claimable } = this.props;
        if (claimable === 0n) {
            return true;
        }
        const { status } = this.state;
        if (status === Status.claiming) {
            return true;
        }
        return false;
    }
    async claim(
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
        const moe_treasury = MoeTreasuryFactory({
            token: this.props.token
        });
        const on_claim_tx: OnClaim = async (
            acc, id, amount, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            this.setState({
                status: Status.claimed
            }, () => {
                const { onClaimed } = this.props;
                if (onClaimed) onClaimed(
                    BigInt(acc), full_id,
                    amount.toBigInt()
                );
            });
        };
        let tx: Transaction | undefined;
        Alerts.hide();
        try {
            this.setState({
                status: Status.claiming
            }, () => {
                const { onClaiming, claimable } = this.props;
                if (onClaiming) onClaiming(
                    address, full_id, claimable
                );
            });
            moe_treasury.then(
                (c) => c.on('Claim', on_claim_tx)
            );
            const contract = await OtfWallet.connect(
                await moe_treasury
            );
            tx = await contract.claimFor(
                x40(address), core_id
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
                const $claimer_row = ancestor(
                    this.ref<HTMLElement>(core_id).current,
                    (e) => e.classList.contains('row')
                );
                alert(ex.message, Alert.warning, {
                    style: { margin: '0.5em 0 -0.5em 0' },
                    after: $claimer_row
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
        const { token } = this.props;
        const apr = this.apr(
            nft_issue, nft_level
        );
        return <button type='button'
            className='btn btn-outline-warning info'
            data-bs-placement='top' data-bs-toggle='tooltip'
            title={`Claim ${token}s for staked ${Nft.nameOf(nft_level)} NFTs at ${apr.toFixed(3)}% APR`}
        >
            <InfoCircle fill={true} />
        </button>;
    }
    apr(
        nft_issue: NftIssue, nft_level: NftLevel
    ) {
        const now_year = new Date().getFullYear();
        return nft_level + (now_year - nft_issue) / 1000;
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
export default PptClaimer;
