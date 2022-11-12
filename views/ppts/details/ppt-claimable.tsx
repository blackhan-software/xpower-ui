import { nice } from '../../../source/functions';
import { Amount, NftIssue, Token, TokenInfo } from '../../../source/redux/types';
import { Tokenizer } from '../../../source/token';

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
    const atoken = Tokenizer.aify(token);
    const { decimals } = TokenInfo(token);
    const nice_value = typeof value === 'bigint'
        ? nice(value, { base: 10 ** decimals }) : '';
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
                value={nice_value}
            />
            <span className='input-group-text info'
                data-bs-placement='top' data-bs-toggle='tooltip'
                title={`Min. amount of claimable ${atoken} rewards (for ${issue})`}
            >
                <InfoCircle fill={true} />
            </span>
        </div>
    </React.Fragment>;
}
export default UiPptClaimable;
