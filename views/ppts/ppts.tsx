import './ppts.scss';

import {
    Amount, Nft, NftIssue, NftLevel, Nfts, NftToken, PptAmounts, PptDetails, PptFlags, PptMinter, PptMinterList, Token
} from '../../source/redux/types';

import React from 'react';
import { UiPptList } from './list/list';
import { UiPptMinter } from './minter/minter';

type Props = {
    ppts: Nfts; token: Token; flags: PptFlags;
    details: Record<NftToken, PptDetails>;
    minter: Record<NftToken, PptMinter>;
    amounts: Record<NftToken, PptAmounts>;
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
    onPptMinterApproval?: (
        token: Token
    ) => void
    onPptMinterBatchMint?: (
        token: Token, list: PptMinterList
    ) => void;
    onPptMinterBatchBurn?: (
        token: Token, list: PptMinterList
    ) => void;
    onPptMinterBatchClaim?: (
        token: Token
    ) => void;
    onPptMinterToggled?: (
        toggled: boolean
    ) => void;
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
    const { ppts, token } = props;
    const ppt_token = Nft.token(token);
    const { flags, toggled } = props;
    const { amounts, minter } = props;
    return <React.Fragment>
        <label className='form-label'>
            Stake & Manage {token} NFTs
        </label>
        <div id='ppt-batch-minting'>
            <UiPptMinter
                approval={
                    minter[ppt_token].approval
                }
                onApproval={
                    props.onPptMinterApproval
                }
                minter_list={
                    join(flags, amounts[ppt_token])
                }
                minter_status={
                    minter[ppt_token].minter_status
                }
                onBatchMint={
                    props.onPptMinterBatchMint
                }
                burner_status={
                    minter[ppt_token].burner_status
                }
                onBatchBurn={
                    props.onPptMinterBatchBurn
                }
                claimer_status={
                    minter[ppt_token].claimer_status
                }
                onBatchClaim={
                    props.onPptMinterBatchClaim
                }
                onToggled={
                    props.onPptMinterToggled
                }
                toggled={toggled}
                token={token}
                ppts={ppts}
            />
        </div>
        <div id='ppt-single-minting'>
            <UiPptList
                ppts={ppts}
                list={
                    join(flags, amounts[ppt_token])
                }
                onPptList={(
                    list
                ) => {
                    const { lhs, rhs } = split(list);
                    const { onPptList } = props;
                    if (onPptList) onPptList(lhs, rhs);
                }}
                details={
                    props.details[ppt_token]
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
                token={token}
            />
        </div>
    </React.Fragment>;
}
export default UiPpts;
