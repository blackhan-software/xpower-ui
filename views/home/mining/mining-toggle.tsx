import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { MiningManager } from '../../../source/managers';
import { Token } from '../../../source/redux/types';

import React from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    token: Token;
}
type State = {
    status: Status | null;
    disabled: boolean;
}
enum Status {
    initializing,
    initialized,
    starting,
    started,
    stopping,
    stopped,
    pausing,
    paused,
    resuming,
    resumed
}
export class MiningToggle extends React.Component<
    Props, State
> {
    constructor(props: {
        token: Token
    }) {
        super(props);
        this.state = {
            status: null, disabled: false
        };
        this.events();
    }
    async events() {
        Blockchain.onConnect(({
            address, token
        }) => {
            const miner = MiningManager.miner(address, {
                token
            });
            if (!miner.running) {
                this.setState({ status: Status.stopped });
            }
            this.setState({
                disabled: miner.speed < 0.001
            });
        });
        Blockchain.onceConnect(({
            address, token
        }) => {
            const miner = MiningManager.miner(address, {
                token
            });
            miner.on('initializing', () => {
                this.setState({ status: Status.initializing });
            });
            miner.on('initialized', () => {
                this.setState({ status: Status.initialized });
            });
            miner.on('starting', () => {
                this.setState({ status: Status.starting });
            });
            miner.on('started', () => {
                this.setState({ status: Status.started });
            });
            miner.on('stopping', () => {
                this.setState({ status: Status.stopping });
            });
            miner.on('stopped', () => {
                this.setState({ status: Status.stopped });
            });
            miner.on('pausing', () => {
                this.setState({ status: Status.pausing });
            });
            miner.on('paused', () => {
                this.setState({ status: Status.paused });
            });
            miner.on('resuming', () => {
                this.setState({ status: Status.resuming });
            });
            miner.on('resumed', () => {
                this.setState({ status: Status.resumed });
            });
            miner.on('increased', (ev) => {
                this.setState({ disabled: ev.speed < 0.001 });
            });
            miner.on('decreased', (ev) => {
                this.setState({ disabled: ev.speed < 0.001 });
            });
        }, {
            per: () => App.token
        });
    }
    render() {
        const { token } = this.props;
        const { status, disabled } = this.state;
        return <div
            className='btn-group toggle-mining' role='group'
        >
            {this.$toggle(token, status, disabled)}
            {this.$info()}
        </div>;
    }
    $toggle(
        token: Token, status: Status | null, disabled: boolean
    ) {
        return <button type='button' id='toggle-mining'
            className='btn btn-outline-warning'
            disabled={this.disabled(status, disabled)}
            onClick={this.toggle.bind(this, token)}
        >
            {Spinner(status)}
            {this.$text(status)}
        </button>
    }
    async toggle(
        token: Token
    ) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address');
        }
        MiningManager.toggle(address, { token });
    }
    disabled(
        status: Status | null, disabled: boolean
    ) {
        if (disabled) {
            return true;
        }
        switch (status) {
            case Status.initialized:
            case Status.started:
            case Status.stopped:
            case Status.paused:
            case Status.resumed:
                return false;
        }
        return true;
    }
    $text(
        status: Status | null
    ) {
        return <span className='text'>
            {this.text(status)}
        </span>;
    }
    text(
        status: Status | null
    ) {
        switch (status) {
            case Status.initializing:
                return 'Initializing Mining…';
            case Status.initialized:
                return 'Start Mining';
            case Status.starting:
                return 'Starting Mining…';
            case Status.started:
                return 'Stop Mining';
            case Status.stopping:
            case Status.stopped:
                return 'Start Mining';
            case Status.pausing:
                return 'Pausing Mining…';
            case Status.paused:
                return 'Resume Mining';
            case Status.resuming:
                return 'Resuming Mining…';
            case Status.resumed:
                return 'Stop Mining';
        }
        return 'Start Mining';
    }
    $info() {
        return <button type='button'
            className='btn btn-outline-warning info'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Toggle mining for XPower tokens (w/o minting them)'
        >
            {InfoCircle({ fill: true })}
        </button>;
    }
}
function Spinner(
    status: Status | null
) {
    const visible = (status: Status | null) => {
        switch (status) {
            case Status.initializing:
            case Status.starting:
            case Status.stopping:
            case Status.pausing:
            case Status.resuming:
                return 'visible';
        }
        switch (status) {
            case Status.started:
                return 'visible';
        }
        return 'hidden';
    };
    const grow = (status: Status | null) => {
        switch (status) {
            case Status.initializing:
            case Status.starting:
            case Status.stopping:
            case Status.pausing:
            case Status.resuming:
                return 'spinner-grow';
        }
        return '';
    };
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow(status)
    ];
    return <span
        className={classes.join(' ')} role='status'
        style={{ visibility: visible(status) }}
    />;
}
export default MiningToggle;
