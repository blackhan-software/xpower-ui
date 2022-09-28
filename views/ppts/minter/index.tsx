import { App } from '../../../source/app';
import { Token } from '../../../source/redux/types';
import { PptMinterList } from '../../../source/redux/types';
import { PptMinterApproval } from '../../../source/redux/types';
import { PptMinterStatus, PptBurnerStatus } from '../../../source/redux/types';

import { UiPptBatchMinter } from './ppt-batch-minter';
export { UiPptBatchMinter };
import { UiPptBatchBurner } from './ppt-batch-burner';
export { UiPptBatchBurner };

import React, { useEffect } from 'react';
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
export function UiPptMinter(
    props: Props
) {
    useEffect(() => {
        App.event.emit('refresh-tips');
    });
    return <div
        className='btn-group ppt-batch-minter' role='group'
    >
        {$toggleAll(props)}
        {$burnApproval(props)}
        {$pptBatchMinter(props)}
        {$pptBatchBurner(props)}
        {$info(props)}
    </div>;
}
function $toggleAll(
    { toggled, onToggled }: Props
) {
    const title = !toggled
        ? 'Show all NFT levels'
        : 'Hide all NFT levels';
    return <button
        type='button' id='toggle-all'
        className='btn btn-outline-warning no-ellipsis'
        data-bs-placement='top' data-bs-toggle='tooltip'
        onClick={onToggled?.bind(null, !toggled)}
        title={title}
    >
        <i className={toggled
            ? 'bi-chevron-double-up'
            : 'bi-chevron-double-down'
        } />
    </button>;
}
function $burnApproval(
    { token, approval, onApproval }: Props
) {
    const is_approved = approved(approval);
    const is_approving = approving(approval);
    const text = is_approving
        ? 'Approving NFT Staking…'
        : 'Approve NFT Staking';
    return <button type='button' id='ppt-burn-approval'
        className='btn btn-outline-warning'
        data-bs-placement='top' data-bs-toggle='tooltip'
        disabled={is_approving || is_approved || is_approved === null}
        onClick={onApproval?.bind(null, token)}
        style={{ display: !is_approved ? 'block' : 'none' }}
        title={`Approve staking (and unstaking) of NFTs`}
    >
        {Spinner({
            show: !!is_approving, grow: true
        })}
        <span className='text'>{text}</span>
    </button>;
}
function $pptBatchMinter(
    { approval, list, minter_status, token, onBatchMint }: Props
) {
    return <UiPptBatchMinter
        approved={approved(approval)}
        list={list}
        status={minter_status}
        token={token}
        onBatchMint={onBatchMint}
    />;
}
function $pptBatchBurner(
    { approval, list, burner_status, token, onBatchBurn }: Props
) {
    return <UiPptBatchBurner
        approved={approved(approval)}
        list={list}
        status={burner_status}
        token={token}
        onBatchBurn={onBatchBurn}
    />;
}
function $info(
    { token }: Props
) {
    return <button type='button'
        className='btn btn-outline-warning info'
        data-bs-placement='top' data-bs-toggle='tooltip'
        title={`(Batch) stake or unstake ${token} NFTs`}
    >
        <InfoCircle fill={true} />
    </button>;
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
export default UiPptMinter;
