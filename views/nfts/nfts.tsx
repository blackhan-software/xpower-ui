import './nfts.scss';

import {
    Amount,
    NftAmounts, NftDetails, NftFlags, NftIssue, NftLevel, NftMinter, NftMinterList, Nfts
} from '../../source/redux/types';

import React from 'react';
import { UiNftList } from './list/list';
import { UiNftMinter } from './minter/minter';

type Props = {
    nfts: Nfts;
    flags: NftFlags;
    amounts: NftAmounts;
    details: NftDetails;
    minter: NftMinter;
    onNftList?: (
        flags: NftFlags,
        amounts: NftAmounts
    ) => void;
    /**
     * nft-list:
     */
    onNftImageLoaded?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    onNftSenderExpanded?: (
        issue: NftIssue,
        level: NftLevel,
        expanded: boolean
    ) => void;
    onNftTargetChanged?: (
        issue: NftIssue,
        level: NftLevel,
        value: Amount | null,
        valid: boolean | null
    ) => void;
    onNftAmountChanged?: (
        issue: NftIssue,
        level: NftLevel,
        value: Amount | null,
        valid: boolean | null
    ) => void;
    onNftTransfer?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    /**
     * nft-minter:
     */
    onNftMinterApproval?: () => void
    onNftMinterBatchMint?: (list: NftMinterList) => void;
    onNftMinterBatchBurn?: (list: NftMinterList) => void;
    onNftMinterBatchUpgrade?: (list: NftMinterList) => void;
    onNftMinterToggled?: (toggled: boolean) => void;
    toggled: boolean;
}
function join(
    lhs: NftFlags, rhs: NftAmounts
) {
    const union = {} as NftFlags & NftAmounts;
    for (const [key, value] of Object.entries(rhs)) {
        const nft_level = key as unknown as NftLevel;
        union[nft_level] = { ...value, ...lhs[nft_level] };
    }
    return union;
}
function split(
    union: Partial<NftFlags & NftAmounts>
) {
    const lhs = {} as NftFlags;
    const rhs = {} as NftAmounts;
    for (const [key, value] of Object.entries(union)) {
        const nft_level = key as unknown as NftLevel;
        const { display, toggled } = value;
        lhs[nft_level] = { display, toggled };
        const { amount1, max1, min1 } = value;
        const { amount2, max2, min2 } = value;
        rhs[nft_level] = {
            amount1, max1, min1,
            amount2, max2, min2,
        };
    }
    return { lhs, rhs };
}
export function UiNfts(
    props: Props
) {
    const { nfts } = props;
    const { flags, toggled } = props;
    const { amounts, minter } = props;
    return <React.Fragment>
        <label className='form-label'>
            Mint and Manage NFTs
        </label>
        <div id='nft-batch-minting'>
            <UiNftMinter
                approval={
                    minter.approval
                }
                onApproval={
                    props.onNftMinterApproval
                }
                minter_list={
                    join(flags, amounts)
                }
                minter_status={
                    minter.minter_status
                }
                onBatchMint={
                    props.onNftMinterBatchMint
                }
                burner_status={
                    minter.burner_status
                }
                onBatchBurn={
                    props.onNftMinterBatchBurn
                }
                upgrader_status={
                    minter.upgrader_status
                }
                onBatchUpgrade={
                    props.onNftMinterBatchUpgrade
                }
                onToggled={
                    props.onNftMinterToggled
                }
                toggled={toggled}
            />
        </div>
        <div id='nft-single-minting'>
            <UiNftList
                nfts={nfts}
                list={
                    join(flags, amounts)
                }
                onNftList={(
                    list
                ) => {
                    const { lhs, rhs } = split(list);
                    const { onNftList } = props;
                    if (onNftList) onNftList(lhs, rhs);
                }}
                details={
                    props.details
                }
                onNftImageLoaded={
                    props.onNftImageLoaded
                }
                onNftSenderExpanded={
                    props.onNftSenderExpanded
                }
                onNftAmountChanged={
                    props.onNftAmountChanged
                }
                onNftTargetChanged={
                    props.onNftTargetChanged
                }
                onNftTransfer={
                    props.onNftTransfer
                }
                toggled={toggled}
            />
        </div>
    </React.Fragment>;
}
export default UiNfts;
