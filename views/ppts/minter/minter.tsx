import { Button, Div } from '../../../source/react';
import { Nfts, PptBurnerStatus, PptClaimerStatus, PptMinterApproval, PptMinterList, PptMinterStatus, Token } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { UiPptBatchBurner } from './ppt-batch-burner';
import { UiPptBatchClaimer } from './ppt-batch-claimer';
import { UiPptBatchMinter } from './ppt-batch-minter';
import { UiPptBurnApproval, approved } from './ppt-burn-approval';

type Props = {
    ppts: Nfts;
    minter_list: PptMinterList;
    approval: PptMinterApproval | null;
    onApproval?: () => void;
    minter_status: PptMinterStatus | null;
    onBatchMint?: (list: PptMinterList) => void;
    burner_status: PptBurnerStatus | null;
    onBatchBurn?: (list: PptMinterList) => void;
    claimer_status: PptClaimerStatus | null;
    onBatchClaim?: () => void;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
}
export function UiPptMinter(
    props: Props
) {
    return <Div
        className='btn-group ppt-batch-minter' role='group'
    >
        {$toggleAll(props)}
        {$burnApproval(props)}
        {$batchReminter(props)}
        {$batchClaimer(props)}
        {$info()}
    </Div>;
}
function $toggleAll(
    { toggled, onToggled }: Props
) {
    const title = !toggled
        ? 'Show all NFT levels'
        : 'Hide all NFT levels';
    return <Button id='toggle-all'
        className='btn btn-outline-warning no-ellipsis'
        onClick={onToggled?.bind(null, !toggled)}
        title={title}
    >
        <i className={toggled
            ? 'bi-chevron-double-up'
            : 'bi-chevron-double-down'
        } />
    </Button>;
}
function $burnApproval(
    { approval, onApproval }: Props
) {
    return <UiPptBurnApproval
        approval={approval}
        onApproval={onApproval}
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
    { approval, minter_list, minter_status, onBatchMint }: Props
) {
    return <UiPptBatchMinter
        approved={approved(approval)}
        list={minter_list}
        onBatchMint={onBatchMint}
        status={minter_status}
    />;
}
function $batchBurner(
    { approval, minter_list, burner_status, onBatchBurn }: Props
) {
    return <UiPptBatchBurner
        approved={approved(approval)}
        list={minter_list}
        onBatchBurn={onBatchBurn}
        status={burner_status}
    />;
}
function $batchClaimer(
    { approval, claimer_status, ppts, onBatchClaim }: Props
) {
    return <UiPptBatchClaimer
        approved={approved(approval)}
        ppts={ppts}
        onBatchClaim={onBatchClaim}
        status={claimer_status}
    />;
}
function $info() {
    return <Button className='btn btn-outline-warning info' title={
        `(Un)stake ${Token.XPOW} NFTs and claim ${Token.APOW} rewards`
    }>
        <InfoCircle fill={true} />
    </Button>;
}
export default UiPptMinter;
