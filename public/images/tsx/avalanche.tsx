import React, { CSSProperties } from 'react';

export function Avalanche({
    height, width, source, style
}: {
    height?: number,
    width?: number,
    source?: string,
    style?: CSSProperties
}) {
    if (source === undefined) {
        source = '/images/png/avalanche-icon/avalanche-64x64.png';
    }
    if (height === undefined) {
        height = 16;
    }
    if (width === undefined) {
        width = 16;
    }
    return <img
        alt="Avalanche"
        height={height}
        src={source}
        style={style}
        width={width}
    />;
}
export default Avalanche;
