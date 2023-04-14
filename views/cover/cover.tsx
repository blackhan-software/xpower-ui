import './cover.scss';

import React from 'react';
import { Page, Rates, Token } from '../../source/redux/types';
import { UiCoverGraph } from './cover-graph';
import { UiCoverImage } from './cover-image';

type Props = {
    page: Page;
    token: Token;
    rates: Rates;
    pulsate: boolean;
}
export function UiCover(
    { page, token, rates, pulsate }: Props
) {
    switch (page) {
        case Page.Home:
            return <div id='cover'>
                <UiCoverImage page={page} pulsate={pulsate} />
            </div>;
        case Page.Nfts:
        case Page.Ppts:
            return <div id='cover'>
                <UiCoverImage page={page} pulsate={pulsate} />
                <UiCoverGraph page={page} token={token} rates={rates} />
            </div>;
        default:
            return null;
    }
}
export default UiCover;
