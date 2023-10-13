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
        onForget?: (level: Level) => void;
        onIgnore?: (level: Level, flag: boolean) => void;
        onMint?: (level: Level) => void;
        rows: Minting['rows'];
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
                onMint={props.minting.onMint}
                onForget={props.minting.onForget}
                onIgnore={props.minting.onIgnore}
                level={ROParams.level.min} rows={rows}
            />
        </div>
    </React.Fragment>;
}
export default UiHome;
