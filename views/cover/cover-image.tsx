import './cover-image.scss';

import React from 'react';
import { Page } from '../../source/redux/types';

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
    const power = page === Page.Home
        ? 'xpower' : 'apower';
    return <img className={classes.join(' ')}
        src={`/images/jpg/cover-${power}.jpg`}
        id='cover' width="736" height="246"
    ></img>;
}
export default UiCoverImage;
