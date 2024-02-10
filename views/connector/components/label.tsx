import React from 'react';
import { State, Chain } from '../connector';

type Props = {
    chain: State['chain'];
}
export function Label(
    { chain }: Props
) {
    return <span className='text'>{text(chain)}</span>;
}
function text(
    chain: State['chain']
) {
    switch (chain) {
        case Chain.UNAVAILABLE:
            return 'Install Wallet';
        case Chain.WRONG_ID:
            return 'Switch to Avalanche';
        case Chain.UNCONNECTED:
            return 'Connect to Wallet';
        case Chain.CONNECTING:
            return 'Connecting to Wallet…';
        case Chain.CONNECTED:
            return 'Connected to Wallet';
    }
}
export default Label;
