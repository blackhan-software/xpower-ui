import React from 'react';
import { Span } from '../../../source/react';
import { Chain, State } from '../connector';

type Props = {
    chain: State['chain'];
}
export function Label(
    { chain }: Props
) {
    return <Span className='text'>{text(chain)}</Span>;
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
