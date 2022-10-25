import { nice } from '../../../source/functions';
import { Amount, NftIssue, Token } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    token: Token;
    value: Amount | null;
}
export function UiPptClaimed(
    { issue, token, value }: Props
) {
    return <React.Fragment>
        <label className='form-label nft-claimed-label d-none d-sm-flex'>
            Claimed Amount
        </label>
        <div className='input-group nft-claimed d-none d-sm-flex'
            role='group'
        >
            <input type='text'
                className='form-control'
                placeholder='0' readOnly
                value={typeof value === 'bigint' ? nice(value, { base: 1e18 }) : ''}
            />
            <span className='input-group-text info'
                data-bs-placement='top' data-bs-toggle='tooltip'
                title={`Amount of claimed ${token} rewards so far (for ${issue})`}
            >
                <InfoCircle fill={true} />
            </span>
        </div>
    </React.Fragment>;
}
export default UiPptClaimed;
