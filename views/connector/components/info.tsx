import React from 'react';
import { Bug, Wifi } from '../../../public/images/tsx';
import { State, WifiLevel, Chain } from '../connector';

type Props = {
    chain: State['chain'];
    level: WifiLevel;
}
export function Info(
    { chain, level }: Props
) {
    return <button
        className='btn btn-outline-warning info'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title={tooltip(chain)} type='button'
    >
        {icon(chain, level)}
    </button>;
}
function icon(
    chain: State['chain'], level: WifiLevel
) {
    switch (chain) {
        case Chain.UNAVAILABLE:
            return <Wifi level={0} />;
        case Chain.WRONG_ID:
            return <Bug fill={true} />;
        case Chain.UNCONNECTED:
            return <Wifi level={0} />;
        case Chain.CONNECTED:
            return <Wifi level={3} />;
        case Chain.CONNECTING:
            return <Wifi level={level} />;
    }
}
function tooltip(
    chain: State['chain']
) {
    switch (chain) {
        case Chain.UNAVAILABLE:
            return 'No wallet found: install one and then reload the page';
        case Chain.WRONG_ID:
            return 'Wrong network — switch to Avalanche and/or toggle VPN connection (if any)';
        case Chain.UNCONNECTED:
            return 'Connect to Avalanche — and/or toggle VPN (if any)';
        case Chain.CONNECTED:
            return 'Connected to Avalanche';
        case Chain.CONNECTING:
            return 'Connecting to Avalanche';
    }
}
export default Info;
