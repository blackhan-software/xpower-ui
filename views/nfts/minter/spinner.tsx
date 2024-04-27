import React from 'react';
import { Span } from '../../../source/react';

type Props = {
    show: boolean;
    grow?: boolean;
    right?: boolean;
}
export function Spinner(
    { show, grow, right }: Props
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        !right ? 'float-start' : 'float-end',
        grow ? 'spinner-grow' : ''
    ];
    return <Span
        className={classes.join(' ')} role='status'
        style={{ display: show ? 'inline-block' : 'none' }} />;
}
export default Spinner;
