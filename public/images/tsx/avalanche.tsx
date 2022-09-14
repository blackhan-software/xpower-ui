import React, { CSSProperties } from 'react';

export function Avalanche({
    height, width, style, source
}: {
    height?: number,
    width?: number,
    source?: string,
    style?: CSSProperties
}) {
    if (source === undefined) {
        source = '/images/png/avalanche-icon/avalanche-64x64.png';
    }
    return <img
        alt="Avalanche"
        height={height ?? 24}
        src={source}
        width={width ?? 24}
        style={style}
    />;
}
export default Avalanche;
