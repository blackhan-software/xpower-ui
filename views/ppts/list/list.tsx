import './amount';
import './list.scss';

import { App } from '../../../source/app';
import { pptsBy, pptTotalBy } from '../../../source/redux/selectors';
import { Amount, Nft, NftIssue, NftLevel, NftLevels, Nfts, PptDetails, Supply, Token } from '../../../source/redux/types';

import React, { useEffect } from 'react';
import { UiPptAmount } from './amount';
import { UiPptDetails } from '../details/details';

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
    useEffect(() => {
        App.event.emit('refresh-tips');
    });
    const { token, list } = props;
    return <React.Fragment>
        <label className='form-label'>
            Stake & Manage {token} NFTs
        </label>
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
    if (display) {
        const total_by = pptTotalBy(props.ppts, {
            level: ppt_level, token: Nft.token(props.token)
        });
        return <div
            className='btn-group ppt-minter' role='group'
            style={{ display: 'inline-flex' }}
        >
            {$toggle(ppt_level, toggled)}
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
        const ppts = pptsBy(props.ppts, {
            token: Nft.token(props.token),
            level: ppt_level
        })
        return <div
            className='nft-details' role='group'
            style={{ display: 'block' }}
        >
            <UiPptDetails
                ppts={ppts}
                level={ppt_level}
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
    ppt_level: NftLevel, toggled: boolean
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
            onClick={() => toggle(ppt_level, toggled)}
            title={title}
        >
            <i className={
                toggled ? 'bi-chevron-up' : 'bi-chevron-down'
            } />
        </button>
    </div>;
}
function toggle(
    ppt_level: NftLevel, toggled: boolean
) {
    App.event.emit('toggle-level', {
        level: ppt_level, flag: !toggled
    });
}
function $minter(
    ppt_level: NftLevel, amount: Amount
) {
    const head = (ppt_level: NftLevel) => {
        const nft_name = Nft.nameOf(ppt_level);
        if (nft_name) return nft_name.slice(0, 1);
    };
    const tail = (ppt_level: NftLevel) => {
        const nft_name = Nft.nameOf(ppt_level);
        if (nft_name) return nft_name.slice(1);
    };
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
        {head(ppt_level)}<span
            className='d-none d-sm-inline'>{tail(ppt_level)} NFTs</span>
    </button>;
}
function $balance(
    ppt_level: NftLevel, total_by: { amount: Amount, supply: Supply }
) {
    return <button type='button'
        className='btn btn-outline-warning balance'
        data-bs-placement='top' data-bs-toggle='tooltip'
        title={`Overall personal balance & supply (staked ${Nft.nameOf(ppt_level)} NFTs)`}
    >
        <span>{
            total_by.amount.toString()
        }</span>
        <span className='d-none d-sm-inline'>
            &nbsp;/&nbsp;
        </span>
        <span className='d-none d-sm-inline'>{
            total_by.supply.toString()
        }</span>
    </button>;
}
export default UiPptList;
