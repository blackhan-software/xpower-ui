import { NftBurnerStatus, NftMinterList } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './spinner';

type Props = {
    approved: boolean | null;
    list: NftMinterList;
    onBatchBurn?: (list: NftMinterList) => void;
    status: NftBurnerStatus | null;
}
export function UiNftBatchBurner(
    { approved, list, status, onBatchBurn }: Props
) {
    const classes = [
        'btn btn-outline-warning',
        approved ? 'show' : '',
        burning(status) ? 'burning' : '',
    ];
    const text = burning(status)
        ? <>Burning<span className="d-none d-sm-inline">&nbsp;NFTs…</span></>
        : <>Burn<span className="d-none d-sm-inline">&nbsp;NFTs</span></>;
    return <button
        type='button' id='nft-batch-burner'
        className={classes.join(' ')}
        disabled={disabled({ list, status })}
        onClick={onBatchBurn?.bind(null, list)}
    >
        {Spinner({
            show: burning(status), grow: true, right: true
        })}
        <span className='text'>{text}</span>
    </button>;
}
function burning(
    status: NftBurnerStatus | null
): boolean {
    return status === NftBurnerStatus.burning;
}
function disabled(
    { list, status }: Pick<Props, 'list' | 'status'>
) {
    if (burning(status)) {
        return true;
    }
    if (!negatives(list)) {
        return true;
    }
    if (!inRange(list)) {
        return true;
    }
    return false;
}
function negatives(
    list: NftMinterList
) {
    const amounts = Object.values(list).map(
        ({ amount1 }) => amount1
    );
    const negatives = amounts.filter(
        (amount) => amount < 0n
    );
    return negatives.length > 0;
}
function inRange(
    list: NftMinterList
) {
    for (const { amount1, min1, max1 } of Object.values(list)) {
        if (amount1 < min1 || max1 < amount1) {
            return false;
        }
    }
    return true;
}
export default UiNftBatchBurner;
