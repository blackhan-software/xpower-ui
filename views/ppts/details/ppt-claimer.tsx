import { Bus } from '../../../source/bus';
import { nice } from '../../../source/functions';
import { Amount, Nft, NftIssue, NftLevel, PptClaimerStatus, Rate, Token } from '../../../source/redux/types';

import React, { useEffect } from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { Button, Div, Span, globalRef } from '../../../source/react';
import { UiPptToggle } from './ui-toggle';

type Props = {
    issue: NftIssue;
    level: NftLevel;
} & {
    rate: Rate;
    claimed: Amount;
    claimable: Amount;
} & {
    onClaim?: (
        issue: NftIssue,
        level: NftLevel
    ) => void;
} & {
    status: PptClaimerStatus | null;
} & {
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
}
export function UiPptClaimer(
    props: Props
) {
    const full_id = Nft.fullId({
        issue: props.issue,
        level: props.level
    });
    return <Div
        className='btn-group nft-claimer d-none d-sm-flex'
        ref={globalRef(`.ppt-claimer[full-id="${full_id}"]`)}
        role='group'
    >
        <UiPptToggle
            toggled={props.toggled}
            onToggled={props.onToggled}
        />
        {$button(props)}
        {$info(props)}
    </Div>;
}
function $button(
    props: Props
) {
    return <Button
        className='btn btn-outline-warning claimer'
        disabled={disabled(props)}
        onClick={props.onClaim?.bind(
            null, props.issue, props.level
        )}
    >
        {Spinner({
            show: props.status === PptClaimerStatus.claiming, grow: true
        })}
        <Span className='text'>{text(props)}</Span>
    </Button>;
}
function text(
    { status }: Props
) {
    return status === PptClaimerStatus.claiming
        ? 'Claiming Rewards…'
        : 'Claim Rewards';
}
function disabled(
    { claimable, claimed, status }: Props
) {
    if (status === PptClaimerStatus.claiming) {
        return true;
    }
    if (claimable === 0n) {
        return true;
    }
    if (claimed < 0n) {
        return true;
    }
    return false;
}
function $info(
    props: Props
) {
    const rate = rateOf(props);
    useEffect(
        () => Bus.emit('refresh-tips'), [rate]
    );
    const { level } = props;
    return <Button className='btn btn-outline-warning info' title={
        `Claim ${Token.APOW}s for staked ${Nft.nameOf(level)} NFTs at ${nice(rate, {
            maxPrecision: 2, minPrecision: 2
        })}%`
    }>
        <InfoCircle fill={true} />
    </Button>;
}
function rateOf(
    { rate }: Props
) {
    return Number(rate) / 1e6;
}
function Spinner(
    { show, grow }: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow ? 'spinner-grow' : ''
    ];
    return <Span
        className={classes.join(' ')} role='status'
        style={{ display: show ? 'inline-block' : 'none' }}
    />;
}
export default UiPptClaimer;
