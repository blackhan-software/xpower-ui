import { Nfts, PptBurnerStatus, PptClaimerStatus, PptMinterApproval, PptMinterList, PptMinterStatus, Token } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { Tokenizer } from '../../../source/token';
import { UiPptBatchBurner } from './ppt-batch-burner';
import { UiPptBatchClaimer } from './ppt-batch-claimer';
import { UiPptBatchMinter } from './ppt-batch-minter';

type Props = {
    ppts: Nfts;
    minter_list: PptMinterList;
    approval: PptMinterApproval | null;
    onApproval?: (token: Token) => void;
    minter_status: PptMinterStatus | null;
    onBatchMint?: (token: Token, list: PptMinterList) => void;
    burner_status: PptBurnerStatus | null;
    onBatchBurn?: (token: Token, list: PptMinterList) => void;
    claimer_status: PptClaimerStatus | null;
    onBatchClaim?: (token: Token) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
    token: Token;
}
export function UiPptMinter(
    props: Props
) {
    return <div
        className='btn-group ppt-batch-minter' role='group'
    >
        {$toggleAll(props)}
        {$burnApproval(props)}
        {$pptBatchReminter(props)}
        {$pptBatchClaimer(props)}
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
function $pptBatchReminter(
    props: Props
) {
    const negatives = Object.values(props.minter_list)
        .map(({ amount }) => amount).filter((a) => a < 0n);
    if (negatives.length) {
        return $pptBatchBurner(props)
    } else {
        return $pptBatchMinter(props)
    }
}
function $pptBatchMinter(
    { approval, minter_list, minter_status, token, onBatchMint }: Props
) {
    return <UiPptBatchMinter
        approved={approved(approval)}
        list={minter_list}
        status={minter_status}
        token={token}
        onBatchMint={onBatchMint}
    />;
}
function $pptBatchBurner(
    { approval, minter_list, burner_status, token, onBatchBurn }: Props
) {
    return <UiPptBatchBurner
        approved={approved(approval)}
        list={minter_list}
        status={burner_status}
        token={token}
        onBatchBurn={onBatchBurn}
    />;
}
function $pptBatchClaimer(
    { approval, claimer_status, ppts, token, onBatchClaim }: Props
) {
    return <UiPptBatchClaimer
        approved={approved(approval)}
        ppts={ppts}
        status={claimer_status}
        token={token}
        onBatchClaim={onBatchClaim}
    />;
}
function $info(
    { token }: Props
) {
    return <button type='button'
        className='btn btn-outline-warning info'
        data-bs-placement='top' data-bs-toggle='tooltip'
        title={`Batch (un)stake NFTs or claim ${Tokenizer.aify(token)} rewards`}
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
        style={{ display: show ? 'inline-block' : 'none' }}
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
