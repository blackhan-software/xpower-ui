import React from 'react';
import { Span } from '../../../source/react';

export function Spinner(
    { show, grow }: { show: boolean; grow?: boolean; }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow ? 'spinner-grow' : ''
    ];
    return <Span
        className={classes.join(' ')} role='status'
        style={{ display: show ? 'block' : 'none' }}
    />;
}
export default Spinner;
