import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from '../../public/images/tsx';
import { Bus } from '../../source/bus';
import { ROParams } from '../../source/params';
import { Nft, NftLevel } from '../../source/redux/types';
import { mobile } from '../../source/functions';

type Props = {
    level: NftLevel,
    setLevel: Dispatch<SetStateAction<NftLevel>>,
}
export function UiCoverGraphControlLevel(
    { level, setLevel }: Props
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
    { level, setLevel }: Props
) {
    if (!maximal(level)) {
        setLevel(level + 3);
    }
}
function decrease(
    { level, setLevel }: Props
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
