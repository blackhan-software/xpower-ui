import { MinerStatus, Token } from '../../../source/redux/types';

import React from 'react';
import { UiMiningToggle } from './mining-toggle';
import { UiMiningSpeed } from './mining-speed';

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
) {
    const { speed, speedable, onSpeed } = props;
    const { status, togglable, onToggle } = props;
    const { token } = props;
    return <React.Fragment>
        <UiMiningToggle
            disabled={!togglable} status={status}
            onToggle={() => onToggle && onToggle(token)}
        />
        <UiMiningSpeed
            disabled={!speedable} speed={speed}
            onSpeed={(by) => onSpeed && onSpeed(token, by)}
        />
    </React.Fragment>;
}
export default UiMining;
