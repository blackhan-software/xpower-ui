import React from 'react';
import { Button } from '../../../source/react';

type Props = {
    onToggled?: (toggled: boolean) => void;
    toggled: boolean;
};
export function RpcToggle(
    { toggled, onToggled }: Props
) {
    const title = !toggled
        ? 'Show RPC end-point'
        : 'Hide RPC end-point';
    return <Button
        className='btn btn-outline-warning no-ellipsis'
        onClick={onToggled?.bind(null, !toggled)}
        id='rpc-toggle' title={title}
    >
        <i className={toggled ? 'bi-chevron-up' : 'bi-chevron-down'} />
    </Button>;
}
export default RpcToggle;
