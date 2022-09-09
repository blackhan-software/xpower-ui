import './connector.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { buffered } from '../../source/functions';
import { sibling } from '../../source/functions';
import { Tooltip } from '../tooltips';

import React from 'react';
import { Unsubscribe } from 'redux';
import { InfoCircle } from '../../public/images/tsx';

type Props = Record<string, never>;
type State = {
    chain: Chain;
}
enum Chain {
    UNAVAILABLE,
    WRONG_ID,
    UNCONNECTED,
    CONNECTING,
    CONNECTED,
}
export class Connector extends React.Component<
    Props, State
> {
    constructor(
        props: Props
    ) {
        super(props);
        this.state = {
            chain: Chain.CONNECTING
        };
    }
    componentDidMount = buffered(async () => {
        this.unTokenSwitch = App.onTokenSwitch(async () => {
            try {
                await Blockchain.connect();
                this.setState({
                    chain: Chain.CONNECTED
                });
            } catch (ex) {
                console.error(ex);
            }
        });
        if (!await Blockchain.isInstalled()) {
            return this.setState({ chain: Chain.UNAVAILABLE });
        }
        if (!await Blockchain.isConnected()) {
            return this.setState({ chain: Chain.UNCONNECTED });
        }
        if (!await Blockchain.isAvalanche()) {
            return this.setState({ chain: Chain.WRONG_ID });
        }
        this.setState({ chain: Chain.CONNECTING });
        try {
            await Blockchain.connect();
            this.setState({
                chain: Chain.CONNECTED
            });
        } catch (ex) {
            console.error(ex);
        }
    }, ms())
    componentWillUnmount() {
        if (this.unTokenSwitch) {
            this.unTokenSwitch();
        }
    }
    render() {
        return <div
            className='btn-group connect-metamask' role='group'
        >
            {this.$connector()}
            {this.$info()}
        </div>;
    }
    $connector() {
        const on_click = async () => {
            if (this.state.chain === Chain.UNAVAILABLE) {
                return open('https://metamask.io/download.html');
            }
            if (this.state.chain === Chain.WRONG_ID) {
                await Blockchain.switchTo(
                    ChainId.AVALANCHE_MAINNET
                );
                return location.reload();
            }
            if (this.state.chain === Chain.UNCONNECTED) {
                return reload(600);
            }
        };
        return <button
            className='btn btn-outline-warning'
            disabled={this.connecting}
            id='connect-metamask'
            onClick={on_click}
            type='button'
        >
            {this.$spinner()}
            {this.$text()}
        </button>;
    }
    $spinner() {
        return Spinner({ show: this.connecting, grow: true });
    }
    get connecting() {
        return this.state.chain === Chain.CONNECTING;
    }
    $text() {
        return <span className='text'>{this.label}</span>;
    }
    get label() {
        switch (this.state.chain) {
            case Chain.UNAVAILABLE:
                return 'Install Metamask';
            case Chain.WRONG_ID:
                return 'Switch to Avalanche';
            case Chain.UNCONNECTED:
                return 'Connect to Metamask';
            case Chain.CONNECTING:
                return 'Connecting to Metamask…';
            case Chain.CONNECTED:
                return 'Connected to Metamask';
        }
    }
    $info() {
        return <button
            className='btn btn-outline-warning info'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title={this.tooltip} type='button'
        >
            {InfoCircle({ fill: true })}
        </button>;
    }
    get tooltip() {
        if (this.state.chain === Chain.UNAVAILABLE) {
            return 'Install Metamask (and then reload the application)';
        }
        return 'Authorize your Metamask to be connected to';
    }
    componentDidUpdate = buffered(() => {
        if (this.state.chain !== Chain.UNAVAILABLE) {
            return;
        }
        const $connect = document.getElementById(
            'connect-metamask'
        );
        const $info = sibling($connect, ($el) => {
            return $el.classList.contains('info');
        });
        if ($info) {
            Tooltip.getInstance($info)?.dispose();
            Tooltip.getOrCreateInstance($info);
        }
    })
    unTokenSwitch?: Unsubscribe;
}
function Spinner(
    state: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm', 'float-start',
        !state.show ? 'd-none' : '', state.grow ? 'spinner-grow' : ''
    ];
    return <span
        className={classes.join(' ')} role='status'
    />;
}
function ms(
    fallback?: number
) {
    if (typeof fallback === 'undefined') {
        if (navigator.userAgent.match(/mobi/i)) {
            fallback = 600;
        } else {
            fallback = 200;
        }
    }
    const ms = Number(
        App.params.get('ms') ?? fallback
    );
    return !isNaN(ms) ? ms : fallback;
}
function reload(
    delta_ms: number
) {
    if (location.search) {
        const match = location.search.match(/ms=([0-9]+)/);
        if (match && match.length > 1) {
            location.search = location.search.replace(
                /ms=([0-9]+)/, `ms=${delta_ms + Number(match[1])}`
            );
        } else {
            location.search += `&ms=${delta_ms}`;
        }
    } else {
        location.search = `?ms=${delta_ms}`;
    }
}
export default Connector;
