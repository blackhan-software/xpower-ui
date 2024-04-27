import { Button, Span } from '../../../source/react';
import { PptMinterList, PptMinterStatus } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './spinner';

type Props = {
    approved: boolean | null;
    list: PptMinterList;
    onBatchMint?: (list: PptMinterList) => void;
    status: PptMinterStatus | null;
}
export function UiPptBatchMinter(
    { approved, list, onBatchMint, status }: Props
) {
    const classes = [
        'btn btn-outline-warning',
        approved ? 'show' : '',
        minting(status) ? 'minting' : '',
    ];
    const text = minting(status)
        ? <>Staking<Span className="d-none d-sm-inline">&nbsp;NFTs…</Span></>
        : <>Stake<Span className="d-none d-sm-inline">&nbsp;NFTs</Span></>;
    return <Button id='ppt-batch-minter'
        className={classes.join(' ')}
        disabled={disabled({ list, status })}
        onClick={onBatchMint?.bind(null, list)}
    >
        {Spinner({
            show: minting(status), grow: true, right: true
        })}
        <Span className='text'>{text}</Span>
    </Button>;
}
function minting(
    status: PptMinterStatus | null
): boolean {
    return status === PptMinterStatus.minting;
}
function disabled(
    { list, status }: Pick<Props, 'list' | 'status'>
) {
    if (minting(status)) {
        return true;
    }
    if (!positives(list)) {
        return true;
    }
    if (!inRange(list)) {
        return true;
    }
    return false;
}
function positives(
    list: PptMinterList
) {
    const amounts = Object.values(list).map(
        ({ amount }) => amount
    );
    const positives = amounts.filter(
        (amount) => amount > 0n
    );
    return positives.length > 0;
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
export default UiPptBatchMinter;
