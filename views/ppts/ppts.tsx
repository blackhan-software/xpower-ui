import './ppts.scss';

import { App } from '../../source/app';
import { Amount, Token } from '../../source/redux/types';
import { PptMinter, PptMinterList } from '../../source/redux/types';
import { PptAmounts, PptDetails, PptFlags } from '../../source/redux/types';
import { Nft, NftIssue, NftToken, NftLevel } from '../../source/redux/types';

import React, { useEffect } from 'react';
import { UiPptList } from './list/list';
export { UiPptList };

import { UiPptDetails } from './details/details';
export { UiPptDetails };
import { UiPptImage, ppt_meta, ppt_href } from './details/details';
export { UiPptImage, ppt_meta, ppt_href };
import { UiPptMinter } from './minter';
export { UiPptMinter };

type Props = {
    token: Token;
    amounts: Record<NftToken, PptAmounts>;
    details: Record<NftToken, PptDetails>;
    minter: Record<NftToken, PptMinter>;
    flags: PptFlags;
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
        issues: NftIssue[],
        level: NftLevel,
        toggled: boolean
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
    useEffect(() => {
        App.event.emit('refresh-tips');
    }, []);
    const { token } = props;
    const ppt_token = Nft.token(token);
    const { flags, toggled } = props;
    const { amounts, minter } = props;
    return <React.Fragment>
        <div id='ppt-single-minting'>
            <UiPptList
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
        <div id='ppt-batch-minting'>
            <UiPptMinter
                list={
                    join(flags, amounts[ppt_token])
                }
                approval={
                    minter[ppt_token].approval
                }
                onApproval={
                    props.onPptMinterApproval
                }
                burner_status={
                    minter[ppt_token].burner_status
                }
                onBatchBurn={
                    props.onPptMinterBatchBurn
                }
                minter_status={
                    minter[ppt_token].minter_status
                }
                onBatchMint={
                    props.onPptMinterBatchMint
                }
                onToggled={
                    props.onPptMinterToggled
                }
                toggled={toggled}
                token={token}
            />
        </div>
    </React.Fragment>;
}
export default UiPpts;
