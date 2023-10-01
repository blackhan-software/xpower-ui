import { NftMinterList, NftUpgraderStatus } from '../../../source/redux/types';

import React from 'react';
import { Spinner } from './spinner';

type Props = {
    approved: boolean | null;
    list: NftMinterList;
    onBatchUpgrade?: (list: NftMinterList) => void;
    status: NftUpgraderStatus | null;
}
export function UiNftBatchUpgrader(
    { approved, list, onBatchUpgrade, status }: Props
) {
    const classes = [
        'btn btn-outline-warning',
        approved ? 'show' : '',
        upgrading(status) ? 'upgrading' : '',
    ];
    const text = upgrading(status)
        ? <>Upgrading<span className="d-none d-sm-inline">&nbsp;NFTs…</span></>
        : <>Upgrade<span className="d-none d-sm-inline">&nbsp;NFTs</span></>;
    return <button
        type='button' id='nft-batch-upgrader'
        className={classes.join(' ')}
        disabled={disabled({ list, status })}
        onClick={onBatchUpgrade?.bind(null, list)}
    >
        {Spinner({
            show: Boolean(upgrading(status)), grow: true
        })}
        <span className='text'>{text}</span>
    </button>;
}
function upgrading(
    status: NftUpgraderStatus | null
): boolean | null {
    return status === NftUpgraderStatus.upgrading;
}
function disabled({ list, status }: {
    list: NftMinterList, status: NftUpgraderStatus | null
}) {
    if (upgrading(status)) {
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
        ({ amount2 }) => amount2
    );
    const positives = amounts.filter(
        (amount) => amount > 0n
    );
    return positives.length > 0;
}
function inRange(
    list: NftMinterList
) {
    for (const { amount2, min2, max2 } of Object.values(list)) {
        if (amount2 < min2 || max2 < amount2) {
            return false;
        }
    }
    return true;
}
export default UiNftBatchUpgrader;
