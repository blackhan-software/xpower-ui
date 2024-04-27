import { Button, Span } from '../../../source/react';
import { pptTotalBy } from '../../../source/redux/selectors';
import { Nfts, PptClaimerStatus } from '../../../source/redux/types';

import React from 'react';
import { UiPptBatchClaimerTitle } from './ppt-batch-claimer-title';
import { Spinner } from './spinner';

type Props = {
    approved: boolean | null;
    onBatchClaim?: () => void;
    status: PptClaimerStatus | null;
} & {
    ppts: Nfts;
}
export function UiPptBatchClaimer(
    { approved, onBatchClaim, ppts, status }: Props
) {
    const classes = [
        'btn btn-outline-warning',
        approved ? 'show' : '',
        claiming(status) ? 'claiming' : '',
    ];
    const title = UiPptBatchClaimerTitle({
        status
    });
    const text = claiming(status)
        ? <>Claiming<Span className="d-none d-sm-inline">&nbsp;Rewards…</Span></>
        : <>Claim<Span className="d-none d-sm-inline">&nbsp;Rewards</Span></>;
    return <Button id='ppt-batch-claimer'
        className={classes.join(' ')}
        disabled={disabled({ ppts, status, title })}
        onClick={onBatchClaim?.bind(null)} title={title}
    >
        {Spinner({
            show: claiming(status), grow: true
        })}
        <Span className='text'>{text}</Span>
    </Button>;
}
function disabled(
    { ppts, status, title }: Omit<Props, 'approved'> & {
        title: string | undefined
    }
) {
    if (!title || title.startsWith('0')) {
        return true;
    }
    if (claiming(status)) {
        return true;
    }
    if (!claimable(ppts)) {
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
    ppts: Props['ppts']
) {
    const { amount } = pptTotalBy({ ppts });
    return amount > 0n;
}
export default UiPptBatchClaimer;
