import { Button, Div } from '../../../source/react';
import { Nfts, PptBurnerStatus, PptClaimerStatus, PptMinterApproval1, PptMinterList, PptMinterStatus, PptMinterApproval2, Token } from '../../../source/redux/types';

import React from 'react';
import { UiPptClaimApproval, approved2 } from './ppt-claim-approval';
import { UiPptStakeApproval, approved1 } from './ppt-stake-approval';
import { InfoCircle } from '../../../public/images/tsx';
import { UiPptBatchBurner } from './ppt-batch-burner';
import { UiPptBatchClaimer } from './ppt-batch-claimer';
import { UiPptBatchMinter } from './ppt-batch-minter';

type Props = {
    ppts: Nfts;
    minter_list: PptMinterList;
    ppt_approval1: PptMinterApproval1 | null;
    onPptApproval1?: () => void;
    ppt_approval2: PptMinterApproval2 | null;
    onPptApproval2?: () => void;
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
        {$claimApproval(props)}
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
    { ppt_approval1, ppt_approval2, onPptApproval1: onApproval }: Props
) {
    return <UiPptStakeApproval
        approval1={ppt_approval1}
        approval2={ppt_approval2}
        onApproval={onApproval}
    />;
}
function $claimApproval(
    { ppt_approval1, ppt_approval2, onPptApproval2: onApproval }: Props
) {
    return <UiPptClaimApproval
        approval1={ppt_approval1}
        approval2={ppt_approval2}
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
    { ppt_approval1, ppt_approval2, minter_list, minter_status, onBatchMint }: Props
) {
    return <UiPptBatchMinter
        approved={approved1(ppt_approval1) && approved2(ppt_approval2)}
        list={minter_list}
        onBatchMint={onBatchMint}
        status={minter_status}
    />;
}
function $batchBurner(
    { ppt_approval1, ppt_approval2, minter_list, burner_status, onBatchBurn }: Props
) {
    return <UiPptBatchBurner
        approved={approved1(ppt_approval1) && approved2(ppt_approval2)}
        list={minter_list}
        onBatchBurn={onBatchBurn}
        status={burner_status}
    />;
}
function $batchClaimer(
    { ppt_approval1, ppt_approval2, claimer_status, ppts, onBatchClaim }: Props
) {
    return <UiPptBatchClaimer
        approved={approved1(ppt_approval1) && approved2(ppt_approval2)}
        ppts={ppts}
        onBatchClaim={onBatchClaim}
        status={claimer_status}
    />;
}
function $info() {
    return <Button className='btn btn-outline-warning info' title={
        `(Un)stake ${Token.XPOW} NFTs and claim *locked* ${Token.APOW}s`
    }>
        <InfoCircle fill={true} />
    </Button>;
}
export default UiPptMinter;
