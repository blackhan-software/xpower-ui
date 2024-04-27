import { nice, nice_si } from '../../../source/functions';
import { Amount, NftIssue, NftLevel, Token, TokenInfo } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';
import { Div, Input, Span } from '../../../source/react';

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
    return <>
        <Div className='form-label nft-claimable-label d-none d-sm-flex'>
            Mintable Amount
        </Div>
        <Div className='input-group nft-claimable d-none d-sm-flex' role='group'>
            <Input className='form-control'
                name={`ppt-claimable-${level}-${issue}`}
                placeholder='0' readOnly value={nice_value}
            />
            <Span className='input-group-text info' title={
                `Mintable ${Token.APOW} due to ${nice_claim} claimables`
            }>
                <InfoCircle fill={true} />
            </Span>
        </Div>
    </>;
}
export default UiPptClaimable;
