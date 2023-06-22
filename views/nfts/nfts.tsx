import './nfts.scss';

import {
    Amount, Nft, NftAmounts, NftDetails, NftFlags, NftIssue, NftLevel, NftMinter, NftMinterList, Nfts, NftToken, Token
} from '../../source/redux/types';

import React from 'react';
import { UiNftList } from './list/list';
import { UiNftMinter } from './minter/minter';

type Props = {
    token: Token; nfts: Nfts; flags: NftFlags;
    amounts: Record<NftToken, NftAmounts>;
    details: Record<NftToken, NftDetails>;
    minter: Record<NftToken, NftMinter>;
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
    onNftMinterApproval?: (
        token: Token
    ) => void
    onNftMinterBatchMint?: (
        token: Token, list: NftMinterList
    ) => void;
    onNftMinterBatchBurn?: (
        token: Token, list: NftMinterList
    ) => void;
    onNftMinterBatchUpgrade?: (
        token: Token, list: NftMinterList
    ) => void;
    onNftMinterToggled?: (
        toggled: boolean
    ) => void;
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
    const { nfts, token } = props;
    const nft_token = Nft.token(token);
    const { flags, toggled } = props;
    const { amounts, minter } = props;
    return <React.Fragment>
        <div id='nft-single-minting'>
            <UiNftList
                nfts={nfts}
                list={
                    join(flags, amounts[nft_token])
                }
                onNftList={(
                    list
                ) => {
                    const { lhs, rhs } = split(list);
                    const { onNftList } = props;
                    if (onNftList) onNftList(lhs, rhs);
                }}
                details={
                    props.details[nft_token]
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
                token={token}
            />
        </div>
        <div id='nft-batch-minting'>
            <UiNftMinter
                approval={
                    minter[nft_token].approval
                }
                onApproval={
                    props.onNftMinterApproval
                }
                minter_list={
                    join(flags, amounts[nft_token])
                }
                minter_status={
                    minter[nft_token].minter_status
                }
                onBatchMint={
                    props.onNftMinterBatchMint
                }
                burner_status={
                    minter[nft_token].burner_status
                }
                onBatchBurn={
                    props.onNftMinterBatchBurn
                }
                upgrader_status={
                    minter[nft_token].upgrader_status
                }
                onBatchUpgrade={
                    props.onNftMinterBatchUpgrade
                }
                onToggled={
                    props.onNftMinterToggled
                }
                toggled={toggled}
                token={token}
            />
        </div>
    </React.Fragment>;
}
export default UiNfts;
