import { PptMinterList, PptMinterStatus, Token } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './index';

type Props = {
    approved: boolean | null;
    list: PptMinterList;
    onBatchMint?: (token: Token, list: PptMinterList) => void;
    status: PptMinterStatus | null;
    token: Token;
}
export function UiPptBatchMinter(
    { approved, list, status, token, onBatchMint }: Props
) {
    const classes = [
        'btn btn-outline-warning',
        approved ? 'show' : ''
    ];
    const text = minting(status)
        ? <>Staking<span className="d-none d-sm-inline">&nbsp;NFTs…</span></>
        : <>Stake<span className="d-none d-sm-inline">&nbsp;NFTs</span></>;
    return <button
        type='button' id='ppt-batch-minter'
        className={classes.join(' ')}
        disabled={disabled({ list, status })}
        onClick={onBatchMint?.bind(null, token, list)}
    >
        {Spinner({
            show: minting(status), grow: true
        })}
        <span className='text'>{text}</span>
    </button>;
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
function minting(
    status: PptMinterStatus | null
): boolean {
    return status === PptMinterStatus.minting;
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
