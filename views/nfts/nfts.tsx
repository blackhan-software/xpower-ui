import './nfts.scss';

import { Amount, Token } from '../../source/redux/types';
import { NftLevel, NftLevels } from '../../source/redux/types';
import { Nft, NftIssue, NftToken } from '../../source/redux/types';

import React, { useEffect } from 'react';
import { UiNftList } from './list/list';
export { UiNftList };

import { UiNftDetails } from './details/details';
export { UiNftDetails };
import { UiNftImage, nft_meta, nft_href } from './details/details';
export { UiNftImage, nft_meta, nft_href };
import { NftDetails, nft_details } from './details/details';
export { NftDetails, nft_details };
import { NftSenderStatus } from './details/details';
export { NftSenderStatus };

import { UiNftMinter } from './minter/minter';
export { UiNftMinter };
import { NftMinter, nft_minter } from './minter/minter';
export { NftMinter, nft_minter };
import { NftMinterApproval } from './minter/minter';
export { NftMinterApproval };
import { NftMinterStatus } from './minter/minter';
export { NftMinterStatus };
import { NftMinterList } from './minter/minter';
import { App } from '../../source/app';
export { NftMinterList };

type Props = {
    token: Token;
    matrix: NftMatrix;
    details: Record<NftToken, NftDetails>;
    minter: Record<NftToken, NftMinter>;
    list: NftList;
    onNftList?: (
        list: NftList,
        matrix: NftMatrix[NftToken]
    ) => void;
    /**
     * nft-list:
     */
    onNftImageLoaded?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
    onNftSenderExpanded?: (
        issues: NftIssue[],
        level: NftLevel,
        toggled: boolean
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
    onNftMinterList?: (
        list: NftList,
        matrix: NftMatrix[NftToken]
    ) => void;
    onNftMinterToggled?: (
        toggled: boolean, ctrlKey: boolean
    ) => void;
    toggled: boolean;
}
export type NftList = Record<NftLevel, {
    display: boolean; toggled: boolean;
}>
export function nft_list(
    display = false, toggled = false
) {
    const entries = Object.fromEntries(
        Array.from(NftLevels()).map(
            (nft_level) => [nft_level, {
                display, toggled
            }]
        )
    );
    return entries as NftList;
}
export type NftMatrix = Record<NftToken, Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
}>>
export function nft_matrix(
    amount = 0n, max = 0n, min = 0n
) {
    return Object.fromEntries(
        Array.from(NftLevels()).map(
            (nft_level) => [nft_level, {
                amount, max, min
            }]
        )
    );
}
function join(
    lhs: NftList, rhs: NftMatrix[NftToken]
) {
    const union = {} as NftList & NftMatrix[NftToken];
    for (const [key, value] of Object.entries(rhs)) {
        const nft_level = key as unknown as NftLevel;
        union[nft_level] = { ...value, ...lhs[nft_level] };
    }
    return union;
}
function split(
    union: Partial<NftList & NftMatrix[NftToken]>
) {
    const lhs = {} as NftList;
    const rhs = {} as NftMatrix[NftToken];
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
    useEffect(() => {
        App.event.emit('refresh-tips');
    }, []);
    const { token } = props;
    const nft_token = Nft.token(token);
    const { list, toggled } = props;
    const { matrix, minter } = props;
    return <React.Fragment>
        <div id='nft-single-minting'>
            <UiNftList
                list={
                    join(list, matrix[nft_token])
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
                list={
                    join(list, matrix[nft_token])
                }
                onList={(list) => {
                    const { lhs, rhs } = split(list);
                    const { onNftMinterList } = props;
                    if (onNftMinterList) onNftMinterList(
                        lhs, rhs
                    );
                }}
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
