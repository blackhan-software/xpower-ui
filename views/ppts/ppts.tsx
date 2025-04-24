import './ppts.scss';

import {
    Amount,
    NftIssue, NftLevel, Nfts,
    PptAmounts, PptDetails, PptFlags, PptMinter, PptMinterList
} from '../../source/redux/types';

import React from 'react';
import { UiPptList } from './list/list';
import { UiPptMinter } from './minter/minter';

type Props = {
    ppts: Nfts;
    flags: PptFlags;
    details: PptDetails;
    minter: PptMinter;
    amounts: PptAmounts;
    onPptList?: (
        flags: PptFlags,
        amounts: PptAmounts
    ) => void;
    /**
     * ppt-list:
     */
    onPptImageLoaded?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    onPptClaimerExpanded?: (
        issue: NftIssue,
        level: NftLevel,
        expanded: boolean
    ) => void;
    onPptTargetChanged?: (
        issue: NftIssue,
        level: NftLevel,
        value: Amount | null,
        valid: boolean | null
    ) => void;
    onPptAmountChanged?: (
        issue: NftIssue,
        level: NftLevel,
        value: Amount | null,
        valid: boolean | null
    ) => void;
    onPptTransfer?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    onPptClaim?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    /**
     * ppt-minter:
     */
    onPptMinterApproval1?: () => void
    onPptMinterApproval2?: () => void
    onPptMinterBatchMint?: (list: PptMinterList) => void;
    onPptMinterBatchBurn?: (list: PptMinterList) => void;
    onPptMinterBatchClaim?: () => void;
    onPptMinterToggled?: (toggled: boolean) => void;
    toggled: boolean;
}
function join(
    lhs: PptFlags, rhs: PptAmounts
) {
    const union = {} as PptFlags & PptAmounts;
    for (const [key, value] of Object.entries(rhs)) {
        const ppt_level = key as unknown as NftLevel;
        union[ppt_level] = { ...value, ...lhs[ppt_level] };
    }
    return union;
}
function split(
    union: Partial<PptFlags & PptAmounts>
) {
    const lhs = {} as PptFlags;
    const rhs = {} as PptAmounts;
    for (const [key, value] of Object.entries(union)) {
        const nft_level = key as unknown as NftLevel;
        const { display, toggled } = value;
        lhs[nft_level] = { display, toggled };
        const { amount, max, min } = value;
        rhs[nft_level] = { amount, max, min };
    }
    return { lhs, rhs };
}
export function UiPpts(
    props: Props
) {
    const { ppts } = props;
    const { flags, toggled } = props;
    const { amounts, minter } = props;
    return <React.Fragment>
        <div className='form-label'>
            Stake NFTs and Claim Rewards
        </div>
        <div id='ppt-batch-minting'>
            <UiPptMinter
                ppt_approval1={
                    minter.ppt_approval1
                }
                onPptApproval1={
                    props.onPptMinterApproval1
                }
                ppt_approval2={
                    minter.ppt_approval2
                }
                onPptApproval2={
                    props.onPptMinterApproval2
                }
                minter_list={
                    join(flags, amounts)
                }
                minter_status={
                    minter.minter_status
                }
                onBatchMint={
                    props.onPptMinterBatchMint
                }
                burner_status={
                    minter.burner_status
                }
                onBatchBurn={
                    props.onPptMinterBatchBurn
                }
                claimer_status={
                    minter.claimer_status
                }
                onBatchClaim={
                    props.onPptMinterBatchClaim
                }
                onToggled={
                    props.onPptMinterToggled
                }
                toggled={toggled}
                ppts={ppts}
            />
        </div>
        <div id='ppt-single-minting'>
            <UiPptList
                ppts={ppts}
                list={
                    join(flags, amounts)
                }
                onPptList={(
                    list
                ) => {
                    const { lhs, rhs } = split(list);
                    const { onPptList } = props;
                    if (onPptList) onPptList(lhs, rhs);
                }}
                details={
                    props.details
                }
                onPptImageLoaded={
                    props.onPptImageLoaded
                }
                onPptClaimerExpanded={
                    props.onPptClaimerExpanded
                }
                onPptAmountChanged={
                    props.onPptAmountChanged
                }
                onPptTargetChanged={
                    props.onPptTargetChanged
                }
                onPptTransfer={
                    props.onPptTransfer
                }
                onPptClaim={
                    props.onPptClaim
                }
                toggled={toggled}
            />
        </div>
    </React.Fragment>;
}
export default UiPpts;
