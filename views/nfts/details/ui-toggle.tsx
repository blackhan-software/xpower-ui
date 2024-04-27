import React from 'react';
import { Button } from '../../../source/react';

type Props = {
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
}
export function UiNftToggle(
    props: Props
) {
    return <Button
        className='btn btn-outline-warning toggle-old no-ellipsis'
        onClick={() => toggle(props)}
        title={title(props)}
    >
        <i className={
            props.toggled ? 'bi-eye-slash-fill' : 'bi-eye-fill'
        } />
    </Button>;
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
export default UiNftToggle;
