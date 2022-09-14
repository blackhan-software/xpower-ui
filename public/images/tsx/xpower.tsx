import { Token, } from '../../../source/redux/types';
import React, { CSSProperties } from 'react';
import Tokenizer from '../../../source/token';

export function XPower({
    token, height, width, style, source
}: {
    token: Token,
    source?: string,
    height?: number,
    width?: number,
    style?: CSSProperties
}) {
    if (source === undefined) {
        source = `/images/svg/${Tokenizer.lower(token)}.svg`;
    }
    return <img
        alt={token}
        height={height ?? 24}
        src={source}
        width={width ?? 24}
        style={style}
    />;
}
export function XPowerBlack({
    token, height, width, style, source
}: {
    token: Token,
    source?: string,
    height?: number,
    width?: number,
    style?: CSSProperties
}) {
    if (source === undefined) {
        source = `/images/svg/${Tokenizer.lower(token)}-black.svg`;
    }
    return <img
        alt={token}
        height={height ?? 24}
        src={source}
        width={width ?? 24}
        style={style}
    />;
}
export default XPower;
