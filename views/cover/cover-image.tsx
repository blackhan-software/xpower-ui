import './cover-image.scss';

import React from 'react';
import { Page } from '../../source/redux/types';

import Home from '../../public/images/jpg/cover-home.jpg';
import Nfts from '../../public/images/jpg/cover-nfts.jpg';
import Ppts from '../../public/images/jpg/cover-ppts.jpg';

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
        className={classes.join(' ')}
        width='736' height='246'
        id='cover' alt='cover'
        src={source(page)}
    ></img>;
}
function source(
    page: Page
) {
    switch (page) {
        case Page.Home:
            return Home;
        case Page.Nfts:
            return Nfts;
        case Page.Ppts:
            return Ppts;
    }
    return null;
}
export default UiCoverImage;
