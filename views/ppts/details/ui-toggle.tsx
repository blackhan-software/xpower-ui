import { App } from '../../../source/app';
import React from 'react';

type Props = {
    toggled: boolean;
    onToggled?: (toggled: boolean, ctrl_key: boolean) => void;
}
export class UiPptToggle extends React.Component<
    Props
> {
    render() {
        const { toggled } = this.props;
        return this.$toggle(toggled);
    }
    $toggle(
        toggled: boolean
    ) {
        return <button type='button'
            className='btn btn-outline-warning toggle-old no-ellipsis'
            data-bs-placement='top' data-bs-toggle='tooltip'
            onClick={(e) => this.toggle(toggled, e.ctrlKey)}
            title={this.title(toggled)}
        >
            <i className={
                toggled ? 'bi-eye-slash-fill' : 'bi-eye-fill'
            } />
        </button>;
    }
    toggle(
        toggled: boolean, ctrl_key: boolean
    ) {
        if (this.props.onToggled) {
            this.props.onToggled(!toggled, ctrl_key);
        }
    }
    title(
        toggled: boolean
    ) {
        return toggled
            ? 'Hide older NFTs [CTRL]'
            : 'Show older NFTs [CTRL]';
    }
    componentDidUpdate() {
        App.event.emit('refresh-tips');
    }
}
export default UiPptToggle;
