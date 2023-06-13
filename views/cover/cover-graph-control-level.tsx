import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle, YinYangCircle } from '../../public/images/tsx';
import { Bus } from '../../source/bus';
import { mobile } from '../../source/functions';
import { ROParams } from '../../source/params';
import { Nft, NftLevel, RebalancerStatus, Token } from '../../source/redux/types';

type Props = {
    controls: {
        rebalancer: {
            onRebalance?: (token: Token, all_levels: boolean) => void;
            status: RebalancerStatus | null;
        };
        levels: {
            setLevel: Dispatch<SetStateAction<NftLevel>>;
            level: NftLevel;
        };
    };
    token: Token;
}
export function UiCoverGraphControlLevel(
    { controls: { rebalancer, levels: { level, setLevel } }, token }: Props
) {
    useEffect(() => {
        setTimeout(() => Bus.emit('refresh-tips'), mobile() ? 600 : 0);
    }, [
        level
    ]);
    return <div className='control-level cover-layer'>
        <div className='btn-group-vertical' role='group'>
            <button
                data-bs-toggle='tooltip' data-bs-placement='left'
                data-disable='true' disabled={maximal(level)}
                className='btn btn-outline-warning upper'
                onClick={() => increase({ level, setLevel })}
                type='button' title={`${next(level)} NFTs`}
            >
                <ArrowUpCircle fill={true} />
            </button>
            <button
                data-bs-toggle='tooltip' data-bs-placement='left'
                data-disable='true' disabled={disabled(rebalancer)}
                className='btn btn-outline-warning middle'
                onClick={(ev) => rebalancer.onRebalance?.(token, ev.ctrlKey)}
                type='button' title='Rebalance Reward Rates'
            >
                <YinYangCircle classes={rotate(rebalancer)} />
            </button>
            <button
                data-bs-toggle='tooltip' data-bs-placement='left'
                data-disable='true' disabled={minimal(level)}
                className='btn btn-outline-warning lower'
                onClick={() => decrease({ level, setLevel })}
                type='button' title={`${previous(level)} NFTs`}
            >
                <ArrowDownCircle fill={true} />
            </button>
        </div>
    </div>;
}
function disabled(
    rebalancer: Props['controls']['rebalancer']
) {
    return rebalancer.status === RebalancerStatus.rebalancing;
}
function rotate(
    rebalancer: Props['controls']['rebalancer']
) {
    return rebalancer.status === RebalancerStatus.rebalancing ? 'rotate' : null;
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
