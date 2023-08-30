import './home.scss';

import { Level, Mining, Minting } from '../../source/redux/types';

import React from 'react';
import { ROParams } from '../../source/params';
import { UiMining } from './mining/mining';
import { UiMinting } from './minting/minting';

type Props = {
    mining: {
        status: Mining['status'];
        togglable: boolean;
        onToggle?: () => void;
        speed: Mining['speed'];
        speedable: boolean;
        onSpeed?: (by: number) => void;
    };
    minting: {
        rows: Minting['rows'];
        onMint?: (level: Level) => void;
        onForget?: (level: Level) => void;
    };
    speed: number;
}
export function UiHome(
    props: Props
) {
    const { status, togglable } = props.mining;
    const { speed, speedable } = props.mining;
    const { rows } = props.minting;
    return <React.Fragment>
        <div id='mining'>
            <UiMining
                onToggle={props.mining.onToggle}
                status={status} togglable={togglable}
                onSpeed={props.mining.onSpeed}
                speed={speed} speedable={speedable}
            />
        </div>
        <div id='minting'>
            <UiMinting
                onForget={props.minting.onForget}
                onMint={props.minting.onMint}
                level={ROParams.level.min} rows={rows}
            />
        </div>
    </React.Fragment>;
}
export default UiHome;
