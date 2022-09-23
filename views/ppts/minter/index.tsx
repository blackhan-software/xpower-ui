import { App } from '../../../source/app';
import { Token } from '../../../source/redux/types';
import { PptMinterList } from '../../../source/redux/types';
import { PptMinterApproval } from '../../../source/redux/types';
import { PptMinterStatus, PptBurnerStatus } from '../../../source/redux/types';

import { UiPptBatchMinter } from './ppt-batch-minter';
export { UiPptBatchMinter };
import { UiPptBatchBurner } from './ppt-batch-burner';
export { UiPptBatchBurner };

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    list: PptMinterList;
    approval: PptMinterApproval | null;
    onApproval?: (token: Token) => void;
    burner_status: PptBurnerStatus | null;
    onBatchBurn?: (token: Token, list: PptMinterList) => void;
    minter_status: PptMinterStatus | null;
    onBatchMint?: (token: Token, list: PptMinterList) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
    token: Token;
}
function approved(
    approval: PptMinterApproval | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === PptMinterApproval.approved;
}
function approving(
    approval: PptMinterApproval | null
): boolean | null {
    if (approval === null) {
        return null;
    }
    return approval === PptMinterApproval.approving;
}
export class UiPptMinter extends React.Component<
    Props
> {
    render() {
        const { minter_status, burner_status } = this.props;
        const { approval, list, toggled, token } = this.props;
        return <div
            className='btn-group ppt-batch-minter' role='group'
        >
            {this.$toggleAll(toggled)}
            {this.$burnApproval(
                token, approved(approval), approving(approval)
            )}
            {this.$pptBatchMinter(
                token, list, approved(approval), minter_status
            )}
            {this.$pptBatchBurner(
                token, list, approved(approval), burner_status
            )}
            {this.$info(token)}
        </div>;
    }
    $toggleAll(
        toggled: boolean
    ) {
        return <button type='button' id='toggle-all'
            className='btn btn-outline-warning no-ellipsis'
            data-bs-placement='top' data-bs-toggle='tooltip'
            onClick={() => this.toggleAll(toggled)}
            title={this.title(toggled)}
        >
            <i className={toggled
                ? 'bi-chevron-double-up'
                : 'bi-chevron-double-down'
            } />
        </button>;
    }
    title(
        toggled: boolean
    ) {
        return !toggled
            ? 'Show all NFT levels'
            : 'Hide all NFT levels';
    }
    toggleAll(
        toggled: boolean
    ) {
        const { onToggled } = this.props;
        if (onToggled) onToggled(!toggled);
    }
    $burnApproval(
        token: Token,
        approved: boolean | null,
        approving: boolean | null
    ) {
        const text = approving
            ? 'Approving NFT Staking…'
            : 'Approve NFT Staking';
        return <button type='button' id='ppt-burn-approval'
            className='btn btn-outline-warning'
            data-bs-placement='top' data-bs-toggle='tooltip'
            disabled={approving || approved || approved === null}
            onClick={this.props.onApproval?.bind(this, token)}
            style={{ display: !approved ? 'block' : 'none' }}
            title={`Approve staking (and unstaking) of NFTs`}
        >
            {Spinner({
                show: !!approving, grow: true
            })}
            <span className='text'>{text}</span>
        </button>;
    }
    $pptBatchMinter(
        token: Token, list: PptMinterList,
        approved: boolean | null, status: PptMinterStatus | null
    ) {
        return <UiPptBatchMinter
            approved={approved} list={list} token={token} status={status}
            onBatchMint={this.props.onBatchMint?.bind(this, token, list)}
        />;
    }
    $pptBatchBurner(
        token: Token, list: PptMinterList,
        approved: boolean | null, status: PptBurnerStatus | null
    ) {
        return <UiPptBatchBurner
            approved={approved} list={list} token={token} status={status}
            onBatchBurn={this.props.onBatchBurn?.bind(this, token, list)}
        />;
    }
    $info(
        token: Token
    ) {
        return <button type='button'
            className='btn btn-outline-warning info'
            data-bs-placement='top' data-bs-toggle='tooltip'
            title={`(Batch) stake or unstake ${token} NFTs`}
        >
            <InfoCircle fill={true} />
        </button>;
    }
    componentDidUpdate() {
        App.event.emit('refresh-tips');
    }
}
export function Spinner(
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
export default UiPptMinter;
