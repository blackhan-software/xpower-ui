import './amount';
import './list.scss';

import { mobile, nice_si } from '../../../source/functions';
import { Button, Div, Span } from '../../../source/react';
import { pptTotalBy } from '../../../source/redux/selectors';
import { Amount, Nft, NftIssue, NftLevel, NftLevels, Nfts, PptDetails, Supply } from '../../../source/redux/types';
import { Years } from '../../../source/years';

import React, { useMemo } from 'react';
import { ExclamationTriange } from '../../../public/images/tsx';
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
    const { ppts } = props;
    const by_level = useMemo(() => pptTotalBy({ ppts }, {
        level: ppt_level
    }), [
        ppts, ppt_level
    ]);
    const by_issues = useMemo(() => Array.from(Years()).map(
        (ppt_issue) => pptTotalBy({ ppts }, {
            level: ppt_level, issue: ppt_issue
        })
    ), [
        ppts, ppt_level
    ]);
    if (display) {
        return <Div
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
            {$minter(ppt_level)}
            {$balance(ppt_level, by_level, by_issues)}
            <UiPptAmount
                amount={amount} level={ppt_level}
                max={max} min={min} onUpdate={({
                    amount
                }) => {
                    if (props.onPptList) {
                        props.onPptList({
                            [ppt_level]: { amount }
                        });
                    }
                }} />
        </Div>;
    }
}
function $pptDetails(
    props: Props, ppt_level: NftLevel,
    { display, toggled }: PptList[NftLevel]
) {
    if (display && toggled) {
        return <Div
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
            />
        </Div>;
    }
}
function $toggle(
    ppt_level: NftLevel, toggled: boolean,
    onToggled: (toggled: boolean) => void
) {
    const title = toggled
        ? `Hide ${Nft.nameOf(ppt_level)} NFTs`
        : `Show ${Nft.nameOf(ppt_level)} NFTs`;
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
    ppt_level: NftLevel
) {
    const title = (
        ppt_level: NftLevel
    ) => {
        return `Staked ${Nft.nameOf(ppt_level)} NFTs (with claimable APOW rewards)`;
    };
    return <Button
        className='btn btn-outline-warning minter'
        title={title(ppt_level)}
    >
        {Nft.nameOf(ppt_level)}<Span className='d-none d-sm-inline'> NFTs</Span>
    </Button>;
}
function $balance(
    ppt_level: NftLevel,
    by_level: { amount: Amount, supply: Supply },
    by_issues: Array<{ amount: Amount, supply: Supply }>
) {
    const $warning = $upgradeable(by_issues);
    const title = mobile()
        ? `Overall personal balance` + ($warning ? ' (with ugradeable NFTs)' : '')
        : `Overall personal balance & supply of staked ${Nft.nameOf(ppt_level)}s`;
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
        ? <Span className='ugradeable-ppts'>
            <ExclamationTriange fill={true} />
        </Span>
        : <Span
            className='ugradeable-ppts' title='Ugradeable NFTs'
        >
            <ExclamationTriange fill={true} />
        </Span>;
}
export default UiPptList;
