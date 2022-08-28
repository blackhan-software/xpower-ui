import { Referable } from '../../../source/functions';
import { Amount, Token } from '../../../source/redux/types';
import { Nft, NftIssue, NftLevel } from '../../../source/redux/types';

import React from 'react';
import { UiPptToggle } from './ui-toggle';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    token: Token;
    issue: NftIssue;
    level: NftLevel;
    claimed: Amount;
    claimable: Amount;
    status: PptClaimerStatus | null;
    onClaim?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
}
export enum PptClaimerStatus {
    claiming = 'claiming',
    claimed = 'claimed',
    error = 'error'
}
export class UiPptClaimer extends Referable(React.Component)<
    Props
> {
    render() {
        const { level, issue } = this.props;
        return this.$claimer(issue, level);
    }
    $claimer(
        ppt_issue: NftIssue, ppt_level: NftLevel
    ) {
        const core_id = Nft.coreId({
            issue: ppt_issue, level: ppt_level
        });
        return <div role='group'
            ref={this.global_ref(`ppt-claimer:${core_id}`)}
            className='btn-group nft-claimer d-none d-sm-flex'
            data-id={core_id} data-level={Nft.nameOf(ppt_level)}
        >
            <UiPptToggle
                toggled={this.props.toggled}
                onToggled={this.props.onToggled?.bind(this)}
            />
            {this.$button(ppt_issue, ppt_level)}
            {this.$info(ppt_issue, ppt_level)}
        </div>;
    }
    $button(
        ppt_issue: NftIssue, ppt_level: NftLevel
    ) {
        const { status } = this.props;
        return <button type='button'
            className='btn btn-outline-warning claimer'
            data-state={status} disabled={this.disabled}
            onClick={this.props.onClaim?.bind(
                this, ppt_issue, ppt_level
            )}
        >
            {Spinner({
                show: status === PptClaimerStatus.claiming, grow: true
            })}
            <span className='text'>
                {this.text}
            </span>
        </button>;
    }
    get text() {
        const { status } = this.props;
        return status === PptClaimerStatus.claiming
            ? 'Claiming Rewards…'
            : 'Claim Rewards';
    }
    get disabled() {
        const { status } = this.props;
        if (status === PptClaimerStatus.claiming) {
            return true;
        }
        const { claimable } = this.props;
        if (claimable === 0n) {
            return true;
        }
        const { claimed } = this.props;
        if (claimed < 0n) {
            return true;
        }
        return false;
    }
    $info(
        ppt_issue: NftIssue, ppt_level: NftLevel
    ) {
        const { token } = this.props;
        const apr = this.apr(
            ppt_issue, ppt_level
        );
        return <button type='button'
            className='btn btn-outline-warning info'
            data-bs-placement='top' data-bs-toggle='tooltip'
            title={`Claim ${token}s for staked ${Nft.nameOf(ppt_level)} NFTs at ${apr.toFixed(3)}% APR`}
        >
            <InfoCircle fill={true} />
        </button>;
    }
    apr(
        ppt_issue: NftIssue, ppt_level: NftLevel
    ) {
        const now_year = new Date().getFullYear();
        return ppt_level + (now_year - ppt_issue) / 1000;
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
export default UiPptClaimer;
