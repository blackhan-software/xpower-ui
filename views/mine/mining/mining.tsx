import { MinerStatus } from '../../../source/redux/types';

import React from 'react';
import { UiMiningSpeed } from './mining-speed';
import { UiMiningToggle } from './mining-toggle';

type Props = {
    status: MinerStatus | null;
    togglable: boolean;
    onToggle?: () => void;
    speed: number;
    speedable: boolean;
    onSpeed?: (by: number) => void;
}
export function UiMining(
    props: Props
) {
    const { speed, speedable, onSpeed } = props;
    const { status, togglable, onToggle } = props;
    return <React.Fragment>
        <UiMiningToggle
            disabled={!togglable} status={status}
            onToggle={() => onToggle && onToggle()}
        />
        <UiMiningSpeed
            disabled={!speedable} speed={speed}
            onSpeed={(by) => onSpeed && onSpeed(by)}
        />
    </React.Fragment>;
}
export default UiMining;
