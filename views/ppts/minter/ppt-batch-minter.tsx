import { Token } from '../../../source/redux/types';
import { PptMinterList } from '../../../source/redux/types';
import { PptMinterStatus } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './index';

type Props = {
    approved: boolean | null;
    list: PptMinterList;
    onBatchMint?: (token: Token, list: PptMinterList) => void;
    status: PptMinterStatus | null;
    token: Token;
}
function minting(
    status: PptMinterStatus | null
): boolean {
    return status === PptMinterStatus.minting;
}
export function UiPptBatchMinter({
    approved, list, onBatchMint, status, token
}: Props) {
    const classes = [
        'btn btn-outline-warning',
        approved ? 'show' : ''
    ];
    const disabled = () => {
        if (minting(status)) {
            return true;
        }
        if (!positives(list)) {
            return true;
        }
        return false;
    };
    const text = minting(status)
        ? <>Staking<span className="d-none d-sm-inline">&nbsp;NFTs…</span></>
        : <>Stake<span className="d-none d-sm-inline">&nbsp;NFTs</span></>;
    return <button type='button' id='ppt-batch-minter'
        className={classes.join(' ')} disabled={disabled()}
        onClick={onBatchMint?.bind(null, token, list)}
    >
        {Spinner({
            show: !!minting(status), grow: true
        })}
        <span className='text'>{text}</span>
    </button>;
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
export default UiPptBatchMinter;
