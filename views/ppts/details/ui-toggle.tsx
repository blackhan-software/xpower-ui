import React from 'react';

type Props = {
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
}
export function UiPptToggle(
    props: Props
) {
    return <button type='button'
        className='btn btn-outline-warning toggle-old no-ellipsis'
        data-bs-placement='top' data-bs-toggle='tooltip'
        onClick={() => toggle(props)}
        title={title(props)}
    >
        <i className={
            props.toggled ? 'bi-eye-slash-fill' : 'bi-eye-fill'
        } />
    </button>;
}
function toggle(
    { toggled, onToggled }: Props
) {
    if (onToggled) {
        onToggled(!toggled);
    }
}
function title(
    { toggled }: Props
) {
    return toggled
        ? 'Hide older NFTs'
        : 'Show older NFTs';
}
export default UiPptToggle;
