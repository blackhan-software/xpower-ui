import './ppts.scss';

import { Amount, Token } from '../../source/redux/types';
import { NftLevel, NftLevels } from '../../source/redux/types';
import { Nft, NftIssue, NftToken } from '../../source/redux/types';

import React from 'react';
import { UiPptList } from './list/list';
export { UiPptList };

import { UiPptDetails } from './details/details';
export { UiPptDetails };
import { UiPptImage, ppt_meta, ppt_href } from './details/details';
export { UiPptImage, ppt_meta, ppt_href };
import { PptDetails, ppt_details } from './details/details';
export { PptDetails, ppt_details };
import { PptClaimerStatus } from './details/details';
export { PptClaimerStatus };

import { UiPptMinter } from './minter';
export { UiPptMinter };
import { PptMinter, ppt_minter } from './minter';
export { PptMinter, ppt_minter };
import { PptMinterApproval } from './minter';
export { PptMinterApproval };
import { PptMinterStatus, PptBurnerStatus } from './minter';
export { PptMinterStatus, PptBurnerStatus };
import { PptMinterList } from './minter';
export { PptMinterList };

type Props = {
    token: Token;
    matrix: PptMatrix;
    details: Record<NftToken, PptDetails>;
    minter: Record<NftToken, PptMinter>;
    list: PptList;
    onPptList?: (
        list: PptList,
        matrix: PptMatrix[NftToken]
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
    onPptMinterList?: (
        list: PptList,
        matrix: PptMatrix[NftToken]
    ) => void;
    onPptMinterToggled?: (
        toggled: boolean
    ) => void;
    toggled: boolean;
}
export type PptList = Record<NftLevel, {
    display: boolean; toggled: boolean;
}>
export function ppt_list(
    display = false, toggled = false
) {
    const entries = Object.fromEntries(
        Array.from(NftLevels()).map(
            (ppt_level) => [ppt_level, {
                display, toggled
            }]
        )
    );
    return entries as PptList;
}
export type PptMatrix = Record<NftToken, Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
}>>
export function ppt_matrix(
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
    lhs: PptList, rhs: PptMatrix[NftToken]
) {
    const union = {} as PptList & PptMatrix[NftToken];
    for (const [key, value] of Object.entries(rhs)) {
        const ppt_level = key as unknown as NftLevel;
        union[ppt_level] = { ...value, ...lhs[ppt_level] };
    }
    return union;
}
function split(
    union: Partial<PptList & PptMatrix[NftToken]>
) {
    const lhs = {} as PptList;
    const rhs = {} as PptMatrix[NftToken];
    for (const [key, value] of Object.entries(union)) {
        const nft_level = key as unknown as NftLevel;
        const { display, toggled } = value;
        lhs[nft_level] = { display, toggled };
        const { amount, max, min } = value;
        rhs[nft_level] = { amount, max, min };
    }
    return { lhs, rhs };
}
export class UiPpts extends React.Component<
    Props
> {
    render() {
        const { token } = this.props;
        const ppt_token = Nft.token(token);
        const { list, toggled } = this.props;
        const { matrix, minter } = this.props;
        return <React.Fragment>
            <div id='ppt-single-minting'>
                <UiPptList
                    list={
                        join(list, matrix[ppt_token])
                    }
                    onPptList={(
                        list
                    ) => {
                        const { lhs, rhs } = split(list);
                        const { onPptList } = this.props;
                        if (onPptList) onPptList(lhs, rhs);
                    }}
                    details={
                        this.props.details[ppt_token]
                    }
                    onPptImageLoaded={
                        this.props.onPptImageLoaded?.bind(this)
                    }
                    onPptClaimerExpanded={
                        this.props.onPptClaimerExpanded?.bind(this)
                    }
                    onPptAmountChanged={
                        this.props.onPptAmountChanged?.bind(this)
                    }
                    onPptTargetChanged={
                        this.props.onPptTargetChanged?.bind(this)
                    }
                    onPptTransfer={
                        this.props.onPptTransfer?.bind(this)
                    }
                    onPptClaim={
                        this.props.onPptClaim?.bind(this)
                    }
                    token={token}
                />
            </div>
            <div id='ppt-batch-minting'>
                <UiPptMinter
                    approval={minter[ppt_token].approval}
                    onApproval={
                        this.props.onPptMinterApproval?.bind(this)
                    }
                    list={join(list, matrix[ppt_token])}
                    onList={(list) => {
                        const { lhs, rhs } = split(list);
                        const { onPptMinterList } = this.props;
                        if (onPptMinterList) onPptMinterList(
                            lhs, rhs
                        );
                    }}
                    burner_status={minter[ppt_token].burner_status}
                    onBatchBurn={
                        this.props.onPptMinterBatchBurn?.bind(this)
                    }
                    minter_status={minter[ppt_token].minter_status}
                    onBatchMint={
                        this.props.onPptMinterBatchMint?.bind(this)
                    }
                    toggled={toggled}
                    onToggled={
                        this.props.onPptMinterToggled?.bind(this)
                    }
                    token={token}
                />
            </div>
        </React.Fragment>;
    }
}
export default UiPpts;
