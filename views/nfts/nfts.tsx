import './nfts.scss';

import { Amount, Nft, NftAmounts, NftDetails, NftFlags, NftIssue, NftLevel, NftMinter, NftMinterList, Nfts, NftToken, Token } from '../../source/redux/types';

import React from 'react';
import { UiNftList } from './list/list';
export { UiNftList };
import { UiNftDetails, UiNftImage, nft_href, nft_meta } from './details/details';
export { UiNftDetails, UiNftImage, nft_meta, nft_href };
import { UiNftMinter } from './minter/minter';
export { UiNftMinter };

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
        const { amount, max, min } = value;
        rhs[nft_level] = { amount, max, min };
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
                list={
                    join(flags, amounts[nft_token])
                }
                approval={
                    minter[nft_token].approval
                }
                onApproval={
                    props.onNftMinterApproval
                }
                status={
                    minter[nft_token].status
                }
                onBatchMint={
                    props.onNftMinterBatchMint
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
