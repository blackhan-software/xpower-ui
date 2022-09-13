import { Token } from '../../../source/redux/types';

import React from 'react';
import { MiningToggle, MinerStatus } from './mining-toggle';
import { MiningSpeed } from './mining-speed';
export { MinerStatus };

type Props = {
    status: MinerStatus | null;
    togglable: boolean;
    onToggle?: (token: Token) => void;
    speed: number;
    speedable: boolean;
    onSpeed?: (token: Token, by: number) => void;
    token: Token;
}
export function UiMining(
    props: Props
){
    const { speed, speedable, onSpeed } = props;
    const { status, togglable, onToggle } = props;
    const { token } = props;
    return <React.Fragment>
        <MiningToggle
            disabled={!togglable} status={status}
            onToggle={() => {
                if (onToggle) onToggle(token);
            }}
        />
        <MiningSpeed
            disabled={!speedable} speed={speed}
            onSpeed={(by) => {
                if (onSpeed) onSpeed(token, by);
            }}
        />
    </React.Fragment>;
}
export default UiMining;
