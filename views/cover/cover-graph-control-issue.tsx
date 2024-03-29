import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Toggle, YinYangCircle } from '../../public/images/tsx';
import { capitalize } from '../../routes/functions';
import { Bus } from '../../source/bus';
import { mobile } from '../../source/functions';
import { useLongTap } from '../../source/react';
import { NftIssue, RefresherStatus } from '../../source/redux/types';
import { MAX_YEAR, MIN_YEAR } from '../../source/years';
import { Scale } from './cover-graph-chart-scale';

type Props = {
    controls: {
        refresher: {
            onRefresh?: (all_levels: boolean) => void;
            status: RefresherStatus | null;
        };
        issues: {
            setIssue: Dispatch<SetStateAction<NftIssue>>;
            issue: NftIssue;
        };
        toggle: {
            setScale: Dispatch<SetStateAction<Scale>>;
            scale: Scale;
        };
    };
}
export function UiCoverGraphControlIssue(
    { controls }: Props
) {
    const { issues: { issue, setIssue } } = controls;
    const { toggle: { scale, setScale } } = controls;
    const { refresher } = controls;
    useEffect(() => {
        setTimeout(() => Bus.emit('refresh-tips'), mobile() ? 600 : 0);
    }, [
        issue, scale
    ]);
    return <div className='control-issue cover-layer'>
        <div className='btn-group-vertical' role='group'>
            {$next({ issue, setIssue })}
            {$refresh(refresher)}
            {$prev({ issue, setIssue })}
            {$toggle({ scale, setScale })}
        </div>
    </div>;
}
function $next(
    { issue, setIssue }: Props['controls']['issues']
) {
    return <button
        data-bs-toggle='tooltip' data-bs-placement='left'
        data-disable='true' disabled={maximal(issue)}
        className='btn btn-outline-warning'
        onClick={() => increase({ issue, setIssue })}
        type='button' title={`${next(issue)} issue`}
    >
        <ArrowUpCircle fill={true} />
    </button>;
}
function $refresh(
    refresher: Props['controls']['refresher']
) {
    const $ref = useRef<HTMLButtonElement>(null);
    const [tapped] = useLongTap($ref, () => {
        refresher.onRefresh?.(true);
    });
    const refresh = (all: boolean) => {
        if (!tapped) refresher.onRefresh?.(all);
    };
    return <button ref={$ref}
        data-bs-toggle='tooltip' data-bs-placement='left'
        data-disable='true' disabled={disabled(refresher)}
        className='btn btn-outline-warning'
        onClick={(e) => refresh(e.ctrlKey)}
        type='button' title='Refresh rates'
    >
        <YinYangCircle classes={rotate(refresher)} />
    </button>;
}
function $prev(
    { issue, setIssue }: Props['controls']['issues']
) {
    return <button
        data-bs-toggle='tooltip' data-bs-placement='left'
        data-disable='true' disabled={minimal(issue)}
        className='btn btn-outline-warning'
        onClick={() => decrease({ issue, setIssue })}
        type='button' title={`${previous(issue)} issue`}
    >
        <ArrowDownCircle fill={true} />
    </button>;
}
function $toggle(
    { scale, setScale }: Props['controls']['toggle']
) {
    return <button
        data-bs-toggle='tooltip' data-bs-placement='left'
        className='btn btn-outline-warning d-none d-sm-block'
        onClick={() => toggle({ scale, setScale })}
        type='button' title={`${capitalize(toggled(scale))} scale`}
    >
        <Toggle on={true} style={{
            transform: `rotate(${scale === Scale.logarithmic ? 0 : 180}deg)`
        }} />
    </button>;
}
function disabled(
    refresher: Props['controls']['refresher']
) {
    return refresher.status === RefresherStatus.refreshing;
}
function rotate(
    refresher: Props['controls']['refresher']
) {
    return refresher.status === RefresherStatus.refreshing ? 'rotate' : null;
}
function toggle(
    { scale, setScale }: Props['controls']['toggle']
) {
    setScale(toggled(scale));
}
function toggled(
    scale: Props['controls']['toggle']['scale']
) {
    return scale !== Scale.linear ? Scale.linear : Scale.logarithmic;
}
function next(
    issue: NftIssue
) {
    if (!maximal(issue)) {
        return issue + 1;
    }
    return 'next';
}
function previous(
    issue: NftIssue
) {
    if (!minimal(issue)) {
        return issue - 1;
    }
    return 'previous';
}
function increase(
    { issue, setIssue }: Props['controls']['issues']
) {
    if (!maximal(issue)) {
        setIssue(issue + 1);
    }
}
function decrease(
    { issue, setIssue }: Props['controls']['issues']
) {
    if (!minimal(issue)) {
        setIssue(issue - 1);
    }
}
function maximal(issue: NftIssue) {
    return issue === MAX_YEAR();
}
function minimal(issue: NftIssue) {
    return issue === MIN_YEAR();
}
export default UiCoverGraphControlIssue;
