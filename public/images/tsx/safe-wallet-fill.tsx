import React, { CSSProperties } from 'react';

export function SafeWallet({
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
        height = 20;
    }
    if (width === undefined) {
        width = 20;
    }
    return fill
        ? <svg className='bi safe-wallet-fill' xmlns='http://www.w3.org/2000/svg' fill='currentColor' height={height} width={width} viewBox='0 0 661.62 661.47' style={style}>
            <path d='M531.98,330.7h-49.42c-14.76,0-26.72,11.96-26.72,26.72v71.73c0,14.76-11.96,26.72-26.72,26.72H232.51c-14.76,0-26.72,11.96-26.72,26.72v49.42c0,14.76,11.96,26.72,26.72,26.72h207.99c14.76,0,26.55-11.96,26.55-26.72v-39.65c0-14.76,11.96-25.23,26.72-25.23h38.2c14.76,0,26.72-11.96,26.72-26.72v-83.3c0-14.76-11.96-26.41-26.72-26.41Z' />
            <path d='M205.78,232.52c0-14.76,11.96-26.72,26.72-26.72h196.49c14.76,0,26.72-11.96,26.72-26.72v-49.42c0-14.76-11.96-26.72-26.72-26.72H221.11c-14.76,0-26.72,11.96-26.72,26.72v38.08c0,14.76-11.96,26.72-26.72,26.72h-38.03c-14.76,0-26.72,11.96-26.72,26.72v83.39c0,14.76,12.01,26.12,26.77,26.12h49.42c14.76,0,26.72-11.96,26.72-26.72l-.05-71.44Z' />
            <path d='M307.55,278.75h47.47c15.47,0,28.02,12.56,28.02,28.02v47.47c0,15.47-12.56,28.02-28.02,28.02h-47.47c-15.47,0-28.02-12.56-28.02-28.02v-47.47c0-15.47,12.56-28.02,28.02-28.02Z' />
        </svg>
        : <svg className='bi safe-wallet' xmlns='http://www.w3.org/2000/svg' fill='currentColor' height={height} width={width} viewBox='0 0 661.62 661.47' style={style}>
            <path
                d='M531.98,330.7h-49.42c-14.76,0-26.72,11.96-26.72,26.72v71.73c0,14.76-11.96,26.72-26.72,26.72H232.51c-14.76,0-26.72,11.96-26.72,26.72v49.42c0,14.76,11.96,26.72,26.72,26.72h207.99c14.76,0,26.55-11.96,26.55-26.72v-39.65c0-14.76,11.96-25.23,26.72-25.23h38.2c14.76,0,26.72-11.96,26.72-26.72v-83.3c0-14.76-11.96-26.41-26.72-26.41Z'
                style={{ fill: 'none', stroke: 'currentColor', strokeOpacity: 1, strokeWidth: 32 }} />
            <path
                d='M205.78,232.52c0-14.76,11.96-26.72,26.72-26.72h196.49c14.76,0,26.72-11.96,26.72-26.72v-49.42c0-14.76-11.96-26.72-26.72-26.72H221.11c-14.76,0-26.72,11.96-26.72,26.72v38.08c0,14.76-11.96,26.72-26.72,26.72h-38.03c-14.76,0-26.72,11.96-26.72,26.72v83.39c0,14.76,12.01,26.12,26.77,26.12h49.42c14.76,0,26.72-11.96,26.72-26.72l-.05-71.44Z'
                style={{ fill: 'none', stroke: 'currentColor', strokeOpacity: 1, strokeWidth: 32 }} />
            <path
                d='M307.55,278.75h47.47c15.47,0,28.02,12.56,28.02,28.02v47.47c0,15.47-12.56,28.02-28.02,28.02h-47.47c-15.47,0-28.02-12.56-28.02-28.02v-47.47c0-15.47,12.56-28.02,28.02-28.02Z'
                style={{ fill: 'none', stroke: 'currentColor', strokeOpacity: 1, strokeWidth: 32 }} />
        </svg>;
}
export default SafeWallet;