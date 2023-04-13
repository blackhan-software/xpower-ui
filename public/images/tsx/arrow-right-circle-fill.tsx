import React, { CSSProperties } from 'react';

export function ArrowRightCircle({
    fill, height, width, style
}: {
    fill?: boolean,
    height?: number,
    width?: number,
    style?: CSSProperties
}) {
    if (fill === undefined) {
        fill = false;
    }
    if (height === undefined) {
        height = 16;
    }
    if (width === undefined) {
        width = 16;
    }
    return fill
        ? <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-arrow-right-circle-fill' viewBox='0 0 16 16' style={style}>
            <path d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z' />
        </svg>
        : <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-arrow-right-circle' viewBox='0 0 16 16' style={style}>
            <path fill-rule='evenodd' d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z' />
        </svg>;
}
export default ArrowRightCircle;
