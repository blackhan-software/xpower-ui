import { Button, Span } from '../../../source/react';
import { PptBurnerStatus, PptMinterList } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './spinner';

type Props = {
    approved: boolean | null;
    list: PptMinterList;
    onBatchBurn?: (list: PptMinterList) => void;
    status: PptBurnerStatus | null;
}
export function UiPptBatchBurner(
    { approved, list, status, onBatchBurn }: Props
) {
    const classes = [
        'btn btn-outline-warning',
        approved ? 'show' : '',
        burning(status) ? 'burning' : '',
    ];
    const text = burning(status)
        ? <>Unstaking<Span className="d-none d-sm-inline">&nbsp;NFTs…</Span></>
        : <>Unstake<Span className="d-none d-sm-inline">&nbsp;NFTs</Span></>;
    return <Button id='ppt-batch-burner'
        className={classes.join(' ')}
        disabled={disabled({ list, status })}
        onClick={onBatchBurn?.bind(null, list)}
    >
        {Spinner({
            show: burning(status), grow: true, right: true
        })}
        <Span className='text'>{text}</Span>
    </Button>;
}
function burning(
    status: PptBurnerStatus | null
): boolean {
    return status === PptBurnerStatus.burning;
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
    list: PptMinterList
) {
    const amounts = Object.values(list).map(
        ({ amount }) => amount
    );
    const negatives = amounts.filter(
        (amount) => amount < 0n
    );
    return negatives.length > 0;
}
function inRange(
    list: PptMinterList
) {
    for (const { amount, min, max } of Object.values(list)) {
        if (amount < min || max < amount) {
            return false;
        }
    }
    return true;
}
export default UiPptBatchBurner;
