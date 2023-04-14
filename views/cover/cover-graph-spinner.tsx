import React from 'react';

type Props = {
    show: boolean, grow?: boolean
}
export function UiCoverGraphSpinner(
    { show, grow }: Props
) {
    const classes = [
        'spinner spinner-border spinner-border-sm', 'float-start',
        !show ? 'd-none' : '', grow ? 'spinner-grow' : '',
    ].concat([
        'cover-layer',
    ]);
    return <span
        className={classes.join(' ')} role='status'
    />;
}
export default UiCoverGraphSpinner;
