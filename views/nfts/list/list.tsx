import './amount';
import './list.scss';

import { mobile, nice_si } from '../../../source/functions';
import { Button, Div, Span } from '../../../source/react';
import { nftTotalBy } from '../../../source/redux/selectors';
import { Amount, Nft, NftDetails, NftIssue, NftLevel, NftLevels, Nfts, Supply } from '../../../source/redux/types';
import { Years } from '../../../source/years';

import React, { useMemo } from 'react';
import { ExclamationTriange } from '../../../public/images/tsx';
import { UiNftDetails } from '../details/details';
import { UiNftAmount } from './amount';

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
}
export type NftList = Record<NftLevel, {
    amount1: Amount; max1: Amount; min1: Amount;
    amount2: Amount; max2: Amount; min2: Amount;
    display: boolean; toggled: boolean;
}>;
export function UiNftList(
    props: Props
) {
    const { list } = props;
    return <React.Fragment>
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
    { display, toggled, amount1, max1, min1 }: NftList[NftLevel]
) {
    const { nfts } = props;
    const by_level = useMemo(() => nftTotalBy({ nfts }, {
        level: nft_level
    }), [
        nfts, nft_level
    ]);
    const by_issues = useMemo(() => Array.from(Years()).map(
        (nft_issue) => nftTotalBy({ nfts }, {
            level: nft_level, issue: nft_issue
        })
    ), [
        nfts, nft_level
    ]);
    if (display) {
        return <Div
            className='btn-group nft-minter' role='group'
            style={{ display: 'inline-flex' }}
        >
            {$toggle(nft_level, toggled, (toggled) => {
                if (props.onNftList) {
                    props.onNftList({
                        [nft_level]: { toggled }
                    });
                }
            })}
            {$minter(nft_level)}
            {$balance(nft_level, by_level, by_issues)}
            <UiNftAmount
                amount1={amount1} level={nft_level}
                max1={max1} min1={min1} onUpdate={({
                    amount1: amount
                }) => {
                    if (props.onNftList) {
                        props.onNftList({
                            [nft_level]: { amount1: amount }
                        });
                    }
                }} />
        </Div>;
    }
}
function $nftDetails(
    props: Props, nft_level: NftLevel,
    { display, toggled }: NftList[NftLevel]
) {
    if (display && toggled) {
        return <Div
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
            />
        </Div>;
    }
}
function $toggle(
    nft_level: NftLevel, toggled: boolean,
    onToggled: (toggled: boolean) => void
) {
    const title = toggled
        ? `Hide ${Nft.nameOf(nft_level)} NFTs`
        : `Show ${Nft.nameOf(nft_level)} NFTs`;
    return <Div
        className='btn-group' role='group'
    >
        <Button
            className='btn btn-outline-warning toggle no-ellipsis'
            onClick={() => onToggled(!toggled)} title={title}
        >
            <i className={
                toggled ? 'bi-chevron-up' : 'bi-chevron-down'
            } />
        </Button>
    </Div>;
}
function $minter(
    nft_level: NftLevel
) {
    const title = (
        nft_level: NftLevel
    ) => {
        return `Stakeable ${Nft.nameOf(nft_level)} NFTs (i.e. a deposit of ${nice_si(10 ** nft_level, { maxPrecision: 0 })} XPOW)`;
    };
    return <Button
        className='btn btn-outline-warning minter'
        title={title(nft_level)}
    >
        {Nft.nameOf(nft_level)}<Span className='d-none d-sm-inline'> NFTs</Span>
    </Button>;
}
function $balance(
    nft_level: NftLevel,
    by_level: { amount: Amount, supply: Supply },
    by_issues: Array<{ amount: Amount, supply: Supply }>
) {
    const $warning = $upgradeable(by_issues);
    const title = mobile()
        ? `Overall personal balance` + ($warning ? ' (with ugradeable NFTs)' : '')
        : `Overall personal balance & supply of ${Nft.nameOf(nft_level)} NFTs`;
    return <Button title={title}
        className='btn btn-outline-warning balance'
    >
        {$warning}
        <Span>{nice_si(by_level.amount)}</Span>
        <Span className='d-none d-sm-inline'>&nbsp;/&nbsp;</Span>
        <Span className='d-none d-sm-inline'>{nice_si(by_level.supply)}</Span>
    </Button>;
}
function $upgradeable(
    by_issues: Array<{ amount: Amount, supply: Supply }>
) {
    const upgradeable = by_issues.some(
        ({ amount }) => amount >= 1000n
    );
    if (upgradeable) return mobile()
        ? <Span className='ugradeable-nfts'>
            <ExclamationTriange fill={true} />
        </Span>
        : <Span
            className='ugradeable-nfts' title='Ugradeable NFTs'
        >
            <ExclamationTriange fill={true} />
        </Span>;
}
export default UiNftList;
