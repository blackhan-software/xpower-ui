import React from 'react';

import { pptTotalBy } from '../../../source/redux/selectors';
import { Nft, Nfts, PptClaimerStatus, Token } from '../../../source/redux/types';
import { Spinner } from './index';
import { UiPptBatchClaimerTitle } from './ppt-batch-claimer-title';

type Props = {
    approved: boolean | null;
    ppts: Nfts
    status: PptClaimerStatus | null;
    token: Token;
    onBatchClaim?: (token: Token) => void;
}
export function UiPptBatchClaimer(
    { approved, status, ppts, token, onBatchClaim }: Props
) {
    const classes = [
        'btn btn-outline-warning',
        approved ? 'show' : ''
    ];
    const title = UiPptBatchClaimerTitle({
        status, token
    });
    const text = claiming(status)
        ? <>Claiming<span className="d-none d-sm-inline">&nbsp;Rewards…</span></>
        : <>Claim<span className="d-none d-sm-inline">&nbsp;Rewards</span></>;
    return <button
        type='button' id='ppt-batch-claimer'
        className={classes.join(' ')}
        data-bs-placement='top' data-bs-toggle='tooltip'
        disabled={disabled({ ppts, status, token, title })}
        onClick={onBatchClaim?.bind(null, token)} title={title}
    >
        {Spinner({
            show: claiming(status), grow: true
        })}
        <span className='text'>{text}</span>
    </button>;
}
function disabled(
    { ppts, status, token, title }: Pick<Props, 'ppts' | 'status' | 'token'> & {
        title: string | undefined
    }
) {
    if (claiming(status)) {
        return true;
    }
    if (!claimable(ppts, token)) {
        return true;
    }
    if (!title || title.startsWith('0')) {
        return true;
    }
    return false;
}
function claiming(
    status: Props['status']
): boolean {
    return status === PptClaimerStatus.claiming;
}
function claimable(
    ppts: Props['ppts'], token: Props['token']
) {
    const { amount } = pptTotalBy({ ppts }, {
        token: Nft.token(token)
    });
    return amount > 0n;
}
export default UiPptBatchClaimer;
