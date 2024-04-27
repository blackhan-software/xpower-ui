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
export function UiPptClaimed(
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
        <Div className='form-label nft-claimed-label d-none d-sm-flex'>
            Minted Amount
        </Div>
        <Div className='input-group nft-claimed d-none d-sm-flex' role='group'>
            <Input className='form-control'
                name={`ppt-claimed-${level}-${issue}`}
                placeholder='0' readOnly value={nice_value}
            />
            <Span className='input-group-text info' title={
                `Minted ${Token.APOW} due to ${nice_claim} claims`
            }>
                <InfoCircle fill={true} />
            </Span>
        </Div>
    </>;
}
export default UiPptClaimed;
