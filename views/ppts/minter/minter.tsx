import { Nfts, PptBurnerStatus, PptClaimerStatus, PptMinterApproval, PptMinterList, PptMinterStatus, Token } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { Tokenizer } from '../../../source/token';
import { UiPptBatchBurner } from './ppt-batch-burner';
import { UiPptBatchClaimer } from './ppt-batch-claimer';
import { UiPptBatchMinter } from './ppt-batch-minter';
import { UiPptBurnApproval, approved } from './ppt-burn-approval';

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
        {$batchReminter(props)}
        {$batchClaimer(props)}
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
    { approval, onApproval, token }: Props
) {
    return <UiPptBurnApproval
        approval={approval}
        onApproval={onApproval}
        token={token}
    />;
}
function $batchReminter(
    props: Props
) {
    const negatives = Object.values(props.minter_list)
        .map(({ amount }) => amount).filter((a) => a < 0n);
    if (negatives.length === 0) {
        return $batchMinter(props)
    } else {
        return $batchBurner(props)
    }
}
function $batchMinter(
    { approval, minter_list, minter_status, token, onBatchMint }: Props
) {
    return <UiPptBatchMinter
        approved={approved(approval)}
        list={minter_list}
        onBatchMint={onBatchMint}
        status={minter_status}
        token={token}
    />;
}
function $batchBurner(
    { approval, minter_list, burner_status, token, onBatchBurn }: Props
) {
    return <UiPptBatchBurner
        approved={approved(approval)}
        list={minter_list}
        onBatchBurn={onBatchBurn}
        status={burner_status}
        token={token}
    />;
}
function $batchClaimer(
    { approval, claimer_status, ppts, token, onBatchClaim }: Props
) {
    return <UiPptBatchClaimer
        approved={approved(approval)}
        ppts={ppts}
        onBatchClaim={onBatchClaim}
        status={claimer_status}
        token={token}
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
export default UiPptMinter;
