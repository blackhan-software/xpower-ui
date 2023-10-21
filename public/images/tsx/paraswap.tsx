import React, { CSSProperties } from 'react';

export function Paraswap({
    height, width, style
}: {
    height?: number;
    width?: number;
    style?: CSSProperties;
}) {
    if (height === undefined) {
        height = 16;
    }
    if (width === undefined) {
        width = 16;
    }
    return <svg className='bi dex paraswap' xmlns='http://www.w3.org/2000/svg' fill='currentColor' height={height} width={width} viewBox='0 0 640 640' style={style}>
        <g transform='matrix(2.1605198,0,0,2.1605198,-149.91351,-149.57193)'>
            <path d='M 361.613,334.925 228.312,100.075 95.0046,334.925 Z M 134.635,210.161 195.883,100.075 H 73.3877 Z m 172.537,93.677 H 149.449 l 78.863,-138.941 z'/>
        </g>
    </svg>;
}
