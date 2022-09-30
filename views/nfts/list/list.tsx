import './amount';
import './list.scss';

import { App } from '../../../source/app';
import { nftTotalBy } from '../../../source/redux/selectors';
import { Amount, Nft, NftDetails, NftIssue, NftLevel, NftLevels, Nfts, Supply, Token } from '../../../source/redux/types';

import React, { useEffect, useMemo } from 'react';
import { UiNftAmount } from './amount';
import { UiNftDetails } from '../details/details';

type Props = {
    nfts: Nfts;
    list: NftList;
    onNftList?: (
        list: Partial<NftList>
    ) => void;
    details: NftDetails;
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
    toggled: boolean;
    token: Token;
}
export type NftList = Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
    display: boolean; toggled: boolean;
}>;
export function UiNftList(
    props: Props
) {
    useEffect(() => {
        App.event.emit('refresh-tips');
    });
    const { token, list } = props;
    return <React.Fragment>
        <label className='form-label'>
            Mint & Manage {token} NFTs
        </label>
        {Array.from(NftLevels()).map((
            nft_level
        ) => {
            return <React.Fragment key={nft_level}>
                {$nftMinter(props, nft_level, list[nft_level])}
                {$nftDetails(props, nft_level, list[nft_level])}
            </React.Fragment>
        })}
    </React.Fragment>;
}
function $nftMinter(
    props: Props, nft_level: NftLevel,
    { display, toggled, amount, max, min }: NftList[NftLevel]
) {
    const total_by = useMemo(() => nftTotalBy(props.nfts, {
        level: nft_level, token: Nft.token(props.token)
    }), [
        props.nfts, nft_level, props.token
    ]);
    if (display) {
        return <div
            className='btn-group nft-minter' role='group'
            style={{ display: 'inline-flex' }}
        >
            {$toggle(nft_level, toggled)}
            {$minter(nft_level, props.token)}
            {$balance(nft_level, total_by)}
            <UiNftAmount
                amount={amount}
                level={nft_level}
                max={max} min={min}
                onUpdate={({ amount }) => {
                    if (props.onNftList) {
                        props.onNftList({
                            [nft_level]: { amount }
                        });
                    }
                }} />
        </div>;
    }
}
function $nftDetails(
    props: Props, nft_level: NftLevel,
    { display, toggled }: NftList[NftLevel]
) {
    if (display && toggled) {
        return <div
            className='nft-details' role='group'
            style={{ display: 'block' }}
        >
            <UiNftDetails
                level={nft_level}
                nfts={
                    props.nfts
                }
                details={
                    props.details
                }
                onNftImageLoaded={
                    props.onNftImageLoaded
                }
                onNftSenderExpanded={
                    props.onNftSenderExpanded
                }
                onNftTargetChanged={
                    props.onNftTargetChanged
                }
                onNftAmountChanged={
                    props.onNftAmountChanged
                }
                onNftTransfer={
                    props.onNftTransfer
                }
                token={
                    props.token
                }
            />
        </div>;
    }
}
function $toggle(
    nft_level: NftLevel, toggled: boolean
) {
    const title = toggled
        ? `Hide ${Nft.nameOf(nft_level)} NFTs`
        : `Show ${Nft.nameOf(nft_level)} NFTs`;
    return <div
        className='btn-group' role='group'
    >
        <button type='button'
            className='btn btn-outline-warning toggle no-ellipsis'
            data-bs-placement='top' data-bs-toggle='tooltip'
            onClick={() => toggle(nft_level, toggled)}
            title={title}
        >
            <i className={
                toggled ? 'bi-chevron-up' : 'bi-chevron-down'
            } />
        </button>
    </div>;
}
function toggle(
    nft_level: NftLevel, toggled: boolean
) {
    App.event.emit('toggle-level', {
        level: nft_level, flag: !toggled
    });
}
function $minter(
    nft_level: NftLevel, token: Token
) {
    const head = (nft_level: NftLevel) => {
        const nft_name = Nft.nameOf(nft_level);
        if (nft_name) return nft_name.slice(0, 1);
    };
    const tail = (nft_level: NftLevel) => {
        const nft_name = Nft.nameOf(nft_level);
        if (nft_name) return nft_name.slice(1);
    };
    const title = (
        nft_level: NftLevel, token: Token
    ) => {
        const nft_name = Nft.nameOf(nft_level);
        const lhs_head = head(nft_level);
        const lhs = lhs_head ? `1${lhs_head}` : '';
        const rhs_head = head(nft_level + 3);
        const rhs = rhs_head ? `1${rhs_head}` : `K${lhs_head}`;
        return `Mint ${nft_name} NFTs (for [${lhs}...${rhs}] ${token} tokens)`;
    };
    return <button type='button'
        className='btn btn-outline-warning minter'
        data-bs-placement='top' data-bs-toggle='tooltip'
        title={title(nft_level, token)}
    >
        {head(nft_level)}<span
            className='d-none d-sm-inline'>{tail(nft_level)} NFTs</span>
    </button>;
}
function $balance(
    nft_level: NftLevel, total_by: { amount: Amount, supply: Supply }
) {
    return <button type='button'
        className='btn btn-outline-warning balance'
        data-bs-placement='top' data-bs-toggle='tooltip'
        title={`Overall personal balance & supply (${Nft.nameOf(nft_level)} NFTs)`}
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
export default UiNftList;
