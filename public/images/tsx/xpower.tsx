import { Token, } from '../../../source/redux/types';
import React, { CSSProperties } from 'react';
import Tokenizer from '../../../source/token';

export function XPower({
    token, height, width, source, style
}: {
    token: Token,
    height?: number,
    width?: number,
    source?: string,
    style?: CSSProperties
}) {
    if (source === undefined) {
        source = `/images/svg/${Tokenizer.lower(token)}.svg`;
    }
    if (height === undefined) {
        height = 16;
    }
    if (width === undefined) {
        width = 16;
    }
    return <img
        alt={token}
        height={height}
        src={source}
        style={style}
        width={width}
    />;
}
export default XPower;
