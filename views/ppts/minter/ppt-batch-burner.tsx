import { Token } from '../../../source/redux/types';
import { PptMinterList } from '../../../source/redux/types';
import { PptBurnerStatus } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './index';

type Props = {
    approved: boolean | null;
    list: PptMinterList;
    onBatchBurn?: (token: Token, list: PptMinterList) => void;
    status: PptBurnerStatus | null;
    token: Token;
}
function burning(
    status: PptBurnerStatus | null
): boolean {
    return status === PptBurnerStatus.burning;
}
export function UiPptBatchBurner({
    approved, list, onBatchBurn, status, token
}: Props) {
    const classes = [
        'btn btn-outline-warning',
        approved ? 'show' : ''
    ];
    const disabled = () => {
        if (burning(status)) {
            return true;
        }
        if (!negatives(list)) {
            return true;
        }
        return false;
    };
    const text = burning(status)
        ? <>Unstaking<span className="d-none d-sm-inline">&nbsp;NFTs…</span></>
        : <>Unstake<span className="d-none d-sm-inline">&nbsp;NFTs</span></>;
    return <button type='button' id='ppt-batch-burner'
        className={classes.join(' ')} disabled={disabled()}
        onClick={onBatchBurn?.bind(null, token, list)}
    >
        {Spinner({
            show: !!burning(status), grow: true
        })}
        <span className='text'>{text}</span>
    </button>;
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
export default UiPptBatchBurner;
