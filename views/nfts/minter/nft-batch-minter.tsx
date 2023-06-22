import { NftMinterList, NftMinterStatus, Token } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './spinner';

type Props = {
    approved: boolean | null;
    list: NftMinterList;
    onBatchMint?: (token: Token, list: NftMinterList) => void;
    status: NftMinterStatus | null;
    token: Token;
}
export function UiNftBatchMinter(
    { approved, list, onBatchMint, status, token }: Props
) {
    const classes = [
        'btn btn-outline-warning',
        approved ? 'show' : ''
    ];
    const text = minting(status)
        ? <>Minting<span className="d-none d-sm-inline">&nbsp;NFTs…</span></>
        : <>Mint<span className="d-none d-sm-inline">&nbsp;NFTs</span></>;
    return <button
        type='button' id='nft-batch-minter'
        className={classes.join(' ')}
        disabled={disabled({ list, status })}
        onClick={onBatchMint?.bind(null, token, list)}
    >
        {Spinner({
            show: Boolean(minting(status)), grow: true
        })}
        <span className='text'>{text}</span>
    </button>;
}
function minting(
    status: NftMinterStatus | null
): boolean | null {
    return status === NftMinterStatus.minting;
}
function disabled({ list, status }: {
    list: NftMinterList, status: NftMinterStatus | null
}) {
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
    list: NftMinterList
) {
    const amounts = Object.values(list).map(
        ({ amount1 }) => amount1
    );
    const positives = amounts.filter(
        (amount) => amount > 0n
    );
    return positives.length > 0;
}
function inRange(
    list: NftMinterList
) {
    for (const { amount1, min1 } of Object.values(list)) {
        if (amount1 < min1) {
            return false;
        }
    }
    return true;
}
export default UiNftBatchMinter;
