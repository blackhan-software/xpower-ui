import { nice, nice_si } from '../../../source/functions';
import { Amount, NftIssue, NftLevel, Token, TokenInfo } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    issue: NftIssue;
    level: NftLevel;
    value: Amount | null;
    claim: Amount | null;
}
export function UiPptClaimable(
    { issue, level, value, claim }: Props
) {
    const { decimals } = TokenInfo(Token.XPOW);
    const nice_value = typeof value === 'bigint'
        ? nice(value, { base: 10 ** decimals }) : '';
    const nice_claim = typeof claim === 'bigint'
        ? nice_si(claim, {
            base: 10 ** decimals, minPrecision: 1
        }) : '';
    return <React.Fragment>
        <div className='form-label nft-claimable-label d-none d-sm-flex'>
            Mintable Amount
        </div>
        <div className='input-group nft-claimable d-none d-sm-flex'
            role='group'
        >
            <input type='text'
                className='form-control'
                placeholder='0' readOnly
                value={nice_value}
                name={`ppt-claimable-${level}-${issue}`}
            />
            <span className='input-group-text info'
                data-bs-placement='top' data-bs-toggle='tooltip'
                title={`Mintable ${Token.APOW} due to ${nice_claim} claimables (for ${issue})`}
            >
                <InfoCircle fill={true} />
            </span>
        </div>
    </React.Fragment>;
}
export default UiPptClaimable;
