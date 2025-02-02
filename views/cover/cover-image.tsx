import './cover-image.scss';

import React from 'react';
import { Page } from '../../source/redux/types';

import Mine from '../../public/images/jpg/cover-mine.jpg';
import Nfts from '../../public/images/jpg/cover-nfts.jpg';
import Ppts from '../../public/images/jpg/cover-ppts.jpg';
import Swap from '../../public/images/jpg/cover-swap.jpg';

type Props = {
    page: Page;
    pulsate: boolean;
}
export function UiCoverImage(
    { page, pulsate }: Props
) {
    const classes = [
        pulsate ? 'pulsate' : '', 'cover-layer'
    ];
    return <img
        style={{ opacity: opacity(page) }}
        className={classes.join(' ')}
        width='736' height='245'
        id='cover' alt='cover'
        src={source(page)}
    ></img>;
}
function source(
    page: Page
) {
    switch (page) {
        case Page.Mine:
            return Mine;
        case Page.Nfts:
            return Nfts;
        case Page.Ppts:
            return Ppts;
        case Page.Swap:
            return Swap;
    }
    return null;
}
function opacity(
    page: Page
) {
    switch (page) {
        case Page.Mine:
            return 1.0;
        case Page.Nfts:
            return 0.5;
        case Page.Ppts:
            return 0.5;
    }
    return 1.0;
}
export default UiCoverImage;
