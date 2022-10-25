import { nice } from '../../../source/functions';
import { Amount, NftIssue, Token } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    token: Token;
    value: Amount | null;
}
export function UiPptClaimable(
    { issue, token, value }: Props
) {
    return <React.Fragment>
        <label className='form-label nft-claimable-label d-none d-sm-flex'>
            Claimable Amount
        </label>
        <div className='input-group nft-claimable d-none d-sm-flex'
            role='group'
        >
            <input type='text'
                className='form-control'
                placeholder='0' readOnly
                value={typeof value === 'bigint' ? nice(value, { base: 1e18 }) : ''}
            />
            <span className='input-group-text info'
                data-bs-placement='top' data-bs-toggle='tooltip'
                title={`Min. amount of claimable ${token} rewards (for ${issue})`}
            >
                <InfoCircle fill={true} />
            </span>
        </div>
    </React.Fragment>;
}
export default UiPptClaimable;
