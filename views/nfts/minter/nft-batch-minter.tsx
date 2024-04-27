import { ROParams } from '../../../source/params';
import { Button, Span, WalletContext } from '../../../source/react';
import { NftMinterList, NftMinterStatus, Token, TokenInfo, Wallet } from '../../../source/redux/types';

import React, { useContext } from 'react';
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
    const [wallet] = useContext(WalletContext);
    const classes = [
        'btn btn-outline-warning',
        approved ? 'show' : '',
        minting(status) ? 'minting' : '',
    ];
    const text = minting(status)
        ? <>Minting<Span className="d-none d-sm-inline">&nbsp;NFTs…</Span></>
        : <>Mint<Span className="d-none d-sm-inline">&nbsp;NFTs</Span></>;
    return <Button id='nft-batch-minter'
        className={classes.join(' ')}
        disabled={disabled({ list, status, wallet })}
        onClick={onBatchMint?.bind(null, list)}
    >
        {Spinner({
            show: Boolean(minting(status)), grow: true, right: true
        })}
        <Span className='text'>{text}</Span>
    </Button>;
}
function minting(
    status: NftMinterStatus | null
): boolean | null {
    return status === NftMinterStatus.minting;
}
function disabled({ list, status, wallet }: {
    list: NftMinterList, status: NftMinterStatus | null, wallet: Wallet | null
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
    if (exRange(list, wallet)) {
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
    list: NftMinterList, wallet: Wallet | null
) {
    if (wallet) {
        const { decimals } = TokenInfo(
            Token.XPOW, ROParams.version
        );
        const base = 10n ** BigInt(decimals);
        const aft_wallet = wallet.aft_wallet.items[Token.XPOW];
        if (aft_wallet) {
            const total = Object.entries(list)
                .map(([l, { amount1: a }]) => 10n ** BigInt(l) * a)
                .reduce((acc, a) => acc + a * base, 0n);
            if (total > aft_wallet.amount) {
                return true;
            }
        }
    }
    return false;
}
export default UiNftBatchMinter;
