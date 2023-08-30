import { ROParams } from '../../../source/params';
import { AppState } from '../../../source/redux/store';
import { NftMinterList, NftMinterStatus, TokenInfo } from '../../../source/redux/types';
import { Tokenizer } from '../../../source/token';

import React, { useContext } from 'react';
import { StateContext } from '../../../source/react';
import { Spinner } from './spinner';

type Props = {
    approved: boolean | null;
    list: NftMinterList;
    onBatchMint?: (list: NftMinterList) => void;
    status: NftMinterStatus | null;
}
export function UiNftBatchMinter(
    { approved, list, onBatchMint, status }: Props
) {
    const [state] = useContext(StateContext);
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
        disabled={disabled({ list, status, state })}
        onClick={onBatchMint?.bind(null, list)}
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
function disabled({ list, status, state }: {
    list: NftMinterList, status: NftMinterStatus | null, state: AppState | null
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
    if (exRange(list, state)) {
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
function exRange(
    list: NftMinterList, state: AppState | null
) {
    if (state) {
        const { decimals } = TokenInfo(
            state.token, ROParams.version
        );
        const base = 10n ** BigInt(decimals);
        const xtoken = Tokenizer.xify(state.token);
        const wallet = state.aft_wallet.items[xtoken];
        if (wallet) {
            const total = Object.entries(list)
                .map(([l, { amount1: a }]) => 10n ** BigInt(l) * a)
                .reduce((acc, a) => acc + a * base, 0n);
            if (total > wallet.amount) {
                return true;
            }
        }
    }
    return false;
}
export default UiNftBatchMinter;
