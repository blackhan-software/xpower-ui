import React, { CSSProperties } from 'react';

export function ArrowDownCircle({
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
        ? <svg xmlns='http://www.w3.org/2000/svg' height={height} width={width} fill='currentColor' className='bi bi-arrow-down-circle-fill' viewBox='0 0 16 16' style={style}>
            <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z' />
        </svg>
        : <svg xmlns='http://www.w3.org/2000/svg' height={height} width={width} fill='currentColor' className='bi bi-arrow-down-circle' viewBox='0 0 16 16' style={style}>
            <path fillRule='evenodd' d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z' />
        </svg>;
}
export default ArrowDownCircle;
