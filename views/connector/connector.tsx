import './connector.scss';

import { Blockchain, ChainId } from '../../source/blockchain';
import { delayed, globalRef, mobile } from '../../source/functions';
import { Params } from '../../source/params';
import { Store } from '../../source/redux/store';

import React, { createElement, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { InfoCircle } from '../../public/images/tsx';

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
export function UiConnector() {
    const [chain, set_chain] = useState(
        Chain.CONNECTING
    );
    useEffect(() => {
        delayed(reset, ms())({ silent: false });
    }, []);
    useEffect(() => {
        return Store.onTokenSwitch(() => reset());
    }, []);
    useEffect(() => {
        if (chain !== Chain.CONNECTED) {
            const $ref = globalRef<HTMLElement>(
                '#connect-metamask'
            );
            $ref.current?.focus();
        }
    });
    const reset = async (
        { silent } = { silent: true }
    ) => {
        if (!await Blockchain.isInstalled()) {
            return set_chain(Chain.UNAVAILABLE);
        }
        if (!await Blockchain.isConnected()) {
            return set_chain(Chain.UNCONNECTED);
        }
        if (!await Blockchain.isAvalanche()) {
            return set_chain(Chain.WRONG_ID);
        }
        if (!silent) {
            set_chain(Chain.CONNECTING);
        }
        try {
            await Blockchain.connect();
            set_chain(Chain.CONNECTED);
        } catch (ex) {
            console.error(ex);
        }
    };
    return <div
        className='btn-group connect-metamask' role='group'
    >
        {$connector(chain)}
        {$info(chain)}
    </div>;
}
function $connector(
    chain: State['chain']
) {
    const on_click = async () => {
        if (chain === Chain.UNAVAILABLE) {
            return open('https://metamask.io/download.html');
        }
        if (chain === Chain.WRONG_ID) {
            await Blockchain.switchTo(
                ChainId.AVALANCHE_MAINNET
            );
            return location.reload();
        }
        if (chain === Chain.UNCONNECTED) {
            return reload(600);
        }
    };
    return <button
        ref={globalRef('#connect-metamask')}
        className='btn btn-outline-warning'
        disabled={connecting(chain)}
        id='connect-metamask'
        onClick={on_click}
        type='button'
    >
        {$spinner(chain)}
        {$text(chain)}
    </button>;
}
function $spinner(
    chain: State['chain']
) {
    return Spinner({
        show: connecting(chain), grow: true
    });
}
function connecting(
    chain: State['chain']
) {
    return chain === Chain.CONNECTING;
}
function $text(
    chain: State['chain']
) {
    return <span className='text'>{label(chain)}</span>;
}
function label(
    chain: State['chain']
) {
    switch (chain) {
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
function $info(
    chain: State['chain']
) {
    return <button
        className='btn btn-outline-warning info'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title={tooltip(chain)} type='button'
    >
        <InfoCircle fill={true} />
    </button>;
}
function tooltip(
    chain: State['chain']
) {
    if (chain === Chain.UNAVAILABLE) {
        return 'Install Metamask (and then reload the application)';
    }
    return 'Authorize your Metamask to be connected to';
}
function ms(
    fallback?: number
) {
    if (typeof fallback === 'undefined') {
        fallback = mobile() ? 600 : 200;
    }
    const ms = Number(
        Params.reloadMs ?? fallback
    );
    return !isNaN(ms) ? ms : fallback;
}
function reload(
    delta_ms: number
) {
    if (location.search) {
        const rx = /reload-ms=([0-9]+)/;
        const match = location.search.match(rx);
        if (match && match.length > 1) {
            location.search = location.search.replace(
                rx, `reload-ms=${delta_ms + Number(match[1])}`
            );
        } else {
            location.search += `&reload-ms=${delta_ms}`;
        }
    } else {
        location.search = `?reload-ms=${delta_ms}`;
    }
}
function Spinner(
    { show, grow }: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow ? 'spinner-grow' : ''
    ];
    return <span
        className={classes.join(' ')} role='status'
        style={{ visibility: show ? 'visible' : 'hidden' }}
    />;
}
if (require.main === module) {
    const $header = document.querySelector('form#connector');
    createRoot($header!).render(createElement(UiConnector));
}
export default UiConnector;
