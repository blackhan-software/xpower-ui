import { Button, Span } from '../../../source/react';
import { NftBurnerStatus, NftMinterList } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './spinner';
import { confirm } from '../../../source/functions';

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
        ? <>Burning<Span className="d-none d-sm-inline">&nbsp;NFTs…</Span></>
        : <>Burn<Span className="d-none d-sm-inline">&nbsp;NFTs</Span></>;
    return <Button id='nft-batch-burner'
        className={classes.join(' ')}
        disabled={disabled({ list, status })}
        onClick={async () => {
            const flag = await confirm(
                "Really? Ensure to haved claimed APOWs and confirm burn: 🔥"
            );
            if (flag) {
                onBatchBurn?.(list);
            }
        }}
    >
        {Spinner({
            show: burning(status), grow: true, right: true
        })}
        <Span className='text'>{text}</Span>
    </Button>;
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
