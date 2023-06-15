import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Toggle, YinYangCircle } from '../../public/images/tsx';
import { capitalize } from '../../routes/functions';
import { Bus } from '../../source/bus';
import { mobile } from '../../source/functions';
import { ROParams } from '../../source/params';
import { Nft, NftLevel, RefresherStatus, Token } from '../../source/redux/types';
import { Scale } from './cover-graph-chart-scale';

type Props = {
    controls: {
        refresher: {
            onRefresh?: (token: Token, all_levels: boolean) => void;
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
    token: Token;
}
export function UiCoverGraphControlLevel(
    { controls, token }: Props
) {
    const { levels: { level, setLevel } } = controls;
    const { toggle: { scale, setScale } } = controls;
    const { refresher } = controls;
    useEffect(() => {
        setTimeout(() => Bus.emit('refresh-tips'), mobile() ? 600 : 0);
    }, [
        level, scale
    ]);
    return <div className='control-level cover-layer'>
        <div className='btn-group-vertical' role='group'>
            <button
                data-bs-toggle='tooltip' data-bs-placement='left'
                data-disable='true' disabled={maximal(level)}
                className='btn btn-outline-warning'
                onClick={() => increase({ level, setLevel })}
                type='button' title={`${next(level)} NFTs`}
            >
                <ArrowUpCircle fill={true} />
            </button>
            <button
                data-bs-toggle='tooltip' data-bs-placement='left'
                data-disable='true' disabled={disabled(refresher)}
                className='btn btn-outline-warning'
                onClick={(ev) => refresher.onRefresh?.(token, ev.ctrlKey)}
                type='button' title='Refresh Rates'
            >
                <YinYangCircle classes={rotate(refresher)} />
            </button>
            <button
                data-bs-toggle='tooltip' data-bs-placement='left'
                data-disable='true' disabled={minimal(level)}
                className='btn btn-outline-warning'
                onClick={() => decrease({ level, setLevel })}
                type='button' title={`${previous(level)} NFTs`}
            >
                <ArrowDownCircle fill={true} />
            </button>
            <button
                data-bs-toggle='tooltip' data-bs-placement='left'
                className='btn btn-outline-warning d-none d-sm-block'
                onClick={() => toggle({ scale, setScale })}
                type='button' title={`${capitalize(toggled(scale))} scale`}
            >
                <Toggle on={true} style={{
                    transform: `rotate(${scale === Scale.logarithmic ? 0 : 180}deg)`
                }}/>
            </button>
        </div>
    </div>;
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
