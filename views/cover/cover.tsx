import './cover.scss';

import React from 'react';
import { Page, Rates, RefresherStatus } from '../../source/redux/types';
import { UiCoverGraph } from './cover-graph';
import { UiCoverImage } from './cover-image';

type Props = {
    controls: {
        refresher: {
            onRefresh?: (all_levels: boolean) => void;
            status: RefresherStatus | null;
        };
    };
    options: {
        pulsate: boolean;
    };
    data: {
        rates: Rates;
    };
    page: Page;
}
export function UiCover(
    { controls, page, options, data }: Props
) {
    switch (page) {
        case Page.Mine:
            return <div id='cover'>
                <UiCoverImage
                    page={page}
                    pulsate={options.pulsate}
                />
            </div>;
        case Page.Nfts:
        case Page.Ppts:
            return <div id='cover'>
                <UiCoverImage
                    page={page}
                    pulsate={options.pulsate}
                />
                <UiCoverGraph
                    controls={controls}
                    data={data}
                    page={page}
                />
            </div>;
        // case Page.Swap:
        //     return <div id='cover'>
        //         <UiCoverImage
        //             page={page}
        //             pulsate={options.pulsate}
        //         />
        //     </div>;
        default:
            return null;
    }
}
export default UiCover;
