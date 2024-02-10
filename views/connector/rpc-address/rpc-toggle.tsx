import React from 'react';

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
    return <button
        type='button' id='rpc-toggle'
        className='btn btn-outline-warning no-ellipsis'
        data-bs-placement='top' data-bs-toggle='tooltip'
        onClick={onToggled?.bind(null, !toggled)}
        title={title}
    >
        <i className={toggled ? 'bi-chevron-up' : 'bi-chevron-down'} />
    </button>;
}
export default RpcToggle;
