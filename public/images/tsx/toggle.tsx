import React, { CSSProperties } from 'react';

export function Toggle({
    on, height, width, style
}: {
    on: boolean;
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
    if (on) {
        return <svg className='bi bi-toggle-on' xmlns='http://www.w3.org/2000/svg' height={height} width={width} fill='currentColor' viewBox='0 0 16 16' style={style}>
            <path d='M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z' />
        </svg>;
    } else {
        return <svg className='bi bi-toggle-off' xmlns='http://www.w3.org/2000/svg' height={height} width={width} fill='currentColor' viewBox='0 0 16 16' style={style}>
            <path d='M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z' />
        </svg>;
    }
}
