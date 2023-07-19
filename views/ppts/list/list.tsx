import './amount';
import './list.scss';

import { mobile, nice_si } from '../../../source/functions';
import { pptTotalBy } from '../../../source/redux/selectors';
import { Amount, Nft, NftIssue, NftLevel, NftLevels, Nfts, PptDetails, Supply, Token } from '../../../source/redux/types';

import React, { useMemo } from 'react';
import { UiPptDetails } from '../details/details';
import { UiPptAmount } from './amount';

type Props = {
    ppts: Nfts;
    list: PptList;
    onPptList?: (
        list: Partial<PptList>
    ) => void;
    details: PptDetails;
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
    toggled: boolean;
    token: Token;
}
type PptList = Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
    display: boolean; toggled: boolean;
}>;
export function UiPptList(
    props: Props
) {
    const { list } = props;
    return <React.Fragment>
        {Array.from(NftLevels()).map((
            nft_level
        ) => {
            return <React.Fragment key={nft_level}>
                {$pptMinter(props, nft_level, list[nft_level])}
                {$pptDetails(props, nft_level, list[nft_level])}
            </React.Fragment>
        })}
    </React.Fragment>;
}
function $pptMinter(
    props: Props, ppt_level: NftLevel,
    { display, toggled, amount, max, min }: PptList[NftLevel]
) {
    const { ppts, token } = props;
    const total_by = useMemo(() => pptTotalBy({ ppts }, {
        level: ppt_level, token: Nft.token(token)
    }), [
        ppts, ppt_level, token
    ]);
    if (display) {
        return <div
            className='btn-group ppt-minter' role='group'
            style={{ display: 'inline-flex' }}
        >
            {$toggle(ppt_level, toggled, (toggled) => {
                if (props.onPptList) {
                    props.onPptList({
                        [ppt_level]: { toggled }
                    });
                }
            })}
            {$minter(ppt_level, amount)}
            {$balance(ppt_level, total_by)}
            <UiPptAmount
                amount={amount}
                level={ppt_level}
                max={max} min={min}
                onUpdate={({ amount }) => {
                    if (props.onPptList) {
                        props.onPptList({
                            [ppt_level]: { amount }
                        });
                    }
                }} />
        </div>;
    }
}
function $pptDetails(
    props: Props, ppt_level: NftLevel,
    { display, toggled }: PptList[NftLevel]
) {
    if (display && toggled) {
        return <div
            className='nft-details' role='group'
            style={{ display: 'block' }}
        >
            <UiPptDetails
                level={ppt_level}
                ppts={
                    props.ppts
                }
                details={
                    props.details
                }
                onPptImageLoaded={
                    props.onPptImageLoaded
                }
                onPptClaimerExpanded={
                    props.onPptClaimerExpanded
                }
                onPptTargetChanged={
                    props.onPptTargetChanged
                }
                onPptAmountChanged={
                    props.onPptAmountChanged
                }
                onPptTransfer={
                    props.onPptTransfer
                }
                onPptClaim={
                    props.onPptClaim
                }
                token={
                    props.token
                }
            />
        </div>;
    }
}
function $toggle(
    ppt_level: NftLevel, toggled: boolean,
    onToggled: (toggled: boolean) => void
) {
    const title = toggled
        ? `Hide ${Nft.nameOf(ppt_level)} NFTs`
        : `Show ${Nft.nameOf(ppt_level)} NFTs`;
    return <div
        className='btn-group' role='group'
    >
        <button type='button'
            className='btn btn-outline-warning toggle no-ellipsis'
            data-bs-placement='top' data-bs-toggle='tooltip'
            onClick={() => onToggled(!toggled)}
            title={title}
        >
            <i className={
                toggled ? 'bi-chevron-up' : 'bi-chevron-down'
            } />
        </button>
    </div>;
}
function $minter(
    ppt_level: NftLevel, amount: Amount
) {
    const title = (
        ppt_level: NftLevel, amount: Amount
    ) => {
        const nft_name = Nft.nameOf(ppt_level);
        return amount !== 0n ? amount > 0
            ? `Stake ${nft_name} NFTs`
            : `Unstake ${nft_name} NFTs`
            : `(Un)stake ${nft_name} NFTs`;
    };
    return <button type='button'
        className='btn btn-outline-warning minter'
        data-bs-placement='top' data-bs-toggle='tooltip'
        title={title(ppt_level, amount)}
    >
        {Nft.nameOf(ppt_level)}<span className='d-none d-sm-inline'> NFTs</span>
    </button>;
}
function $balance(
    ppt_level: NftLevel, total_by: { amount: Amount, supply: Supply }
) {
    const title = mobile()
        ? `Overall personal balance`
        : `Overall personal balance & supply (staked ${Nft.nameOf(ppt_level)})`;
    return <button type='button' title={title}
        className='btn btn-outline-warning balance'
        data-bs-placement='top' data-bs-toggle='tooltip'
    >
        <span>{
            nice_si(total_by.amount)
        }</span>
        <span className='d-none d-sm-inline'>
            &nbsp;/&nbsp;
        </span>
        <span className='d-none d-sm-inline'>{
            nice_si(total_by.supply)
        }</span>
    </button>;
}
export default UiPptList;
