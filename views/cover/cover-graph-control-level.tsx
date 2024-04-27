import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Toggle, YinYangCircle } from '../../public/images/tsx';
import { capitalize } from '../../routes/functions';
import { Bus } from '../../source/bus';
import { mobile } from '../../source/functions';
import { ROParams } from '../../source/params';
import { Button, Div, useLongTap } from '../../source/react';
import { Nft, NftLevel, RefresherStatus } from '../../source/redux/types';
import { Scale } from './cover-graph-chart-scale';

type Props = {
    controls: {
        refresher: {
            onRefresh?: (all_levels: boolean) => void;
            status: RefresherStatus | null;
        };
        levels: {
            setLevel: Dispatch<SetStateAction<NftLevel>>;
            level: NftLevel;
        };
        toggle: {
            setScale: Dispatch<SetStateAction<Scale>>;
            scale: Scale;
        };
    };
}
export function UiCoverGraphControlLevel(
    { controls }: Props
) {
    const { levels: { level, setLevel } } = controls;
    const { toggle: { scale, setScale } } = controls;
    const { refresher } = controls;
    useEffect(() => {
        setTimeout(() => Bus.emit('refresh-tips'), mobile() ? 600 : 0);
    }, [
        level, scale
    ]);
    return <Div className='control-level cover-layer'>
        <Div className='btn-group-vertical' role='group'>
            {$next({ level, setLevel })}
            {$refresh(refresher)}
            {$prev({ level, setLevel })}
            {$toggle({ scale, setScale })}
        </Div>
    </Div>;
}
function $next(
    { level, setLevel }: Props['controls']['levels']
) {
    return <Button
        className='btn btn-outline-warning'
        data-bs-placement='left'
        data-disable='true' disabled={maximal(level)}
        onClick={() => increase({ level, setLevel })}
        title={`${next(level)} NFTs`}
    >
        <ArrowUpCircle fill={true} />
    </Button>;
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
    return <Button ref={$ref}
        className='btn btn-outline-warning'
        data-bs-placement='left'
        data-disable='true' disabled={disabled(refresher)}
        onClick={(e) => refresh(e.ctrlKey)}
        title='Refresh Rates'
    >
        <YinYangCircle classes={rotate(refresher)} />
    </Button>;
}
function $prev(
    { level, setLevel }: Props['controls']['levels']
) {
    return <Button
        className='btn btn-outline-warning'
        data-bs-placement='left'
        data-disable='true' disabled={minimal(level)}
        onClick={() => decrease({ level, setLevel })}
        title={`${previous(level)} NFTs`}
    >
        <ArrowDownCircle fill={true} />
    </Button>;
}
function $toggle(
    { scale, setScale }: Props['controls']['toggle']
) {
    return <Button
        className='btn btn-outline-warning d-none d-sm-block'
        data-bs-placement='left'
        onClick={() => toggle({ scale, setScale })}
        title={`${capitalize(toggled(scale))} scale`}
    >
        <Toggle on={true} style={{
            transform: `rotate(${scale === Scale.logarithmic ? 0 : 180}deg)`
        }} />
    </Button>;
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
    level: NftLevel
) {
    if (!maximal(level)) {
        return Nft.nameOf(level + 3)
    }
    return 'next';
}
function previous(
    level: NftLevel
) {
    if (!minimal(level)) {
        return Nft.nameOf(level - 3)
    }
    return 'previous';
}
function increase(
    { level, setLevel }: Props['controls']['levels']
) {
    if (!maximal(level)) {
        setLevel(level + 3);
    }
}
function decrease(
    { level, setLevel }: Props['controls']['levels']
) {
    if (!minimal(level)) {
        setLevel(level - 3);
    }
}
function maximal(level: NftLevel) {
    return level === ROParams.nftLevel.max;
}
function minimal(level: NftLevel) {
    return level === ROParams.nftLevel.min;
}
export default UiCoverGraphControlLevel;
