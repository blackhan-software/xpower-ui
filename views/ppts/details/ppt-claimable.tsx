import { nice } from '../../../source/functions';
import { Amount, Token } from '../../../source/redux/types';
import { Nft, NftIssue, NftLevel } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    token: Token;
    value: Amount | null;
}
export function UiPptClaimable(
    { issue, level, token, value }: Props
) {
    return $amount(issue, level, token, value);
}
function $amount(
    nft_issue: NftIssue, nft_level: NftLevel,
    token: Token, value: Amount | null
) {
    return <React.Fragment>
        <label className='form-label nft-claimable-label d-none d-sm-flex'>
            Claimable Amount
        </label>
        <div className='input-group nft-claimable d-none d-sm-flex'
            data-level={Nft.nameOf(nft_level)} role='group'
        >
            <input type='text'
                className='form-control'
                placeholder='0' readOnly
                value={typeof value === 'bigint' ? nice(value) : ''}
            />
            <span className='input-group-text info'
                data-bs-placement='top' data-bs-toggle='tooltip'
                title={`Min. amount of claimable ${token} rewards (for ${nft_issue})`}
            >
                <InfoCircle fill={true} />
            </span>
        </div>
    </React.Fragment>;
}
export default UiPptClaimable;
