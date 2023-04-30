import React, { CSSProperties } from 'react';

export function Disc({
    fill, height, width, style, rotate
}: {
    fill?: boolean,
    height?: number,
    width?: number,
    style?: CSSProperties,
    rotate?: boolean
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
        ? <svg className={`bi bi-disc-fill ${rotate ? 'rotate' : ''}`} xmlns='http://www.w3.org/2000/svg' fill='currentColor' height={height} width={width} viewBox='0 0 16 16' style={style}>
            <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-6 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0zM4 8a4 4 0 0 1 4-4 .5.5 0 0 0 0-1 5 5 0 0 0-5 5 .5.5 0 0 0 1 0zm9 0a.5.5 0 1 0-1 0 4 4 0 0 1-4 4 .5.5 0 0 0 0 1 5 5 0 0 0 5-5z' />
        </svg>
        : <svg className={`bi bi-disc ${rotate ? 'rotate' : ''}`} xmlns='http://www.w3.org/2000/svg' fill='currentColor' height={height} width={width} viewBox='0 0 16 16' style={style}>
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
            <path d='M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 4a4 4 0 0 0-4 4 .5.5 0 0 1-1 0 5 5 0 0 1 5-5 .5.5 0 0 1 0 1zm4.5 3.5a.5.5 0 0 1 .5.5 5 5 0 0 1-5 5 .5.5 0 0 1 0-1 4 4 0 0 0 4-4 .5.5 0 0 1 .5-.5z' />
        </svg>;
}
export default Disc;
