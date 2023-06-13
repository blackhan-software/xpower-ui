import './cover.scss';

import React from 'react';
import { Page, Rates, RefresherStatus, Token } from '../../source/redux/types';
import { UiCoverGraph } from './cover-graph';
import { UiCoverImage } from './cover-image';

type Props = {
    controls: {
        refresher: {
            onRefresh?: (token: Token, all_levels: boolean) => void;
            status: RefresherStatus | null;
        };
    };
    options: {
        pulsate: boolean;
    };
    data: {
        rates: Rates;
    };
    page: Page; token: Token;
}
export function UiCover(
    { controls, page, options, data, token }: Props
) {
    switch (page) {
        case Page.Home:
            return <div id='cover'>
                <UiCoverImage
                    page={page} pulsate={options.pulsate}
                />
            </div>;
        case Page.Nfts:
        case Page.Ppts:
            return <div id='cover'>
                <UiCoverImage
                    page={page} pulsate={options.pulsate}
                />
                <UiCoverGraph
                    controls={controls} data={data}
                    page={page} token={token}
                />
            </div>;
        default:
            return null;
    }
}
export default UiCover;
