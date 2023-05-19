import { globalRef } from '../../../source/react';
import { Amount, Nft, NftIssue, NftLevel, PptClaimerStatus, Rate, Token } from '../../../source/redux/types';
import { Tokenizer } from '../../../source/token';

import React, { useEffect } from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { UiPptToggle } from './ui-toggle';
import { Bus } from '../../../source/bus';
import { ROParams } from '../../../source/params';
import { Version } from '../../../source/types';

type Props = {
    token: Token;
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
        level: props.level,
        token: Nft.token(props.token)
    });
    return <div role='group'
        ref={globalRef(`.ppt-claimer[full-id="${full_id}"]`)}
        className='btn-group nft-claimer d-none d-sm-flex'
    >
        <UiPptToggle
            toggled={props.toggled}
            onToggled={props.onToggled}
        />
        {$button(props)}
        {$info(props)}
    </div>;
}
function $button(
    props: Props
) {
    return <button type='button'
        className='btn btn-outline-warning claimer'
        disabled={disabled(props)}
        onClick={props.onClaim?.bind(
            null, props.issue, props.level
        )}
    >
        {Spinner({
            show: props.status === PptClaimerStatus.claiming, grow: true
        })}
        <span className='text'>
            {text(props)}
        </span>
    </button>;
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
    const { level, token } = props;
    const atoken = Tokenizer.aify(token);
    return <button type='button'
        className='btn btn-outline-warning info'
        data-bs-placement='top' data-bs-toggle='tooltip'
        title={`Claim ${atoken}s for staked ${Nft.nameOf(level)} NFTs at ${rate.toFixed(2)}%`}
    >
        <InfoCircle fill={true} />
    </button>;
}
function rateOf(
    { rate }: Props
) {
    if (ROParams.version < Version.v7b) {
        return Number(rate) / 1e3;
    }
    return Number(rate) / 1e6;
}
function Spinner(
    { show, grow }: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow ? 'spinner-grow' : ''
    ];
    return <span
        className={classes.join(' ')} role='status'
        style={{ display: show ? 'inline-block' : 'none' }}
    />;
}
export default UiPptClaimer;
