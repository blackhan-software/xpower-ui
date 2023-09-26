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
    return <img
        src={`/images/jpg/cover-${page}.jpg`}
        className={classes.join(' ')}
        width='736' height='246'
        id='cover' alt='cover'
    ></img>;
}
export default UiCoverImage;
