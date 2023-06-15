import React, { CSSProperties } from 'react';

export function ToggleAlt({
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
        return <svg className='bi bi-toggle2-on' xmlns='http://www.w3.org/2000/svg' height={height} width={width} fill='currentColor' viewBox='0 0 16 16' style={style}>
            <path d='M7 5H3a3 3 0 0 0 0 6h4a4.995 4.995 0 0 1-.584-1H3a2 2 0 1 1 0-4h3.416c.156-.357.352-.692.584-1z' />
            <path d='M16 8A5 5 0 1 1 6 8a5 5 0 0 1 10 0z' />
        </svg>;
    } else {
        return <svg className='bi bi-toggle2-off' xmlns='http://www.w3.org/2000/svg' height={height} width={width} fill='currentColor' viewBox='0 0 16 16' style={style}>
            <path d='M9 11c.628-.836 1-1.874 1-3a4.978 4.978 0 0 0-1-3h4a3 3 0 1 1 0 6H9z' />
            <path d='M5 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1A5 5 0 1 0 5 3a5 5 0 0 0 0 10z' />
        </svg>;
    }
}
