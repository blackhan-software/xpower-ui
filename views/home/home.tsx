import './home.scss';

import { Level, Mining, Minting, Token } from '../../source/redux/types';

import React from 'react';
import { ROParams } from '../../source/params';
import { UiMining } from './mining/mining';
import { UiMinting } from './minting/minting';

type Props = {
    mining: {
        status: Mining['status'];
        togglable: boolean;
        onToggle?: (token: Token) => void;
        speed: Mining['speed'];
        speedable: boolean;
        onSpeed?: (token: Token, by: number) => void;
    };
    minting: {
        rows: Minting['rows'];
        onMint?: (token: Token, level: Level) => void;
        onForget?: (token: Token, level: Level) => void;
    };
    speed: number;
    token: Token;
}
export function UiHome(
    props: Props
) {
    const { status, togglable } = props.mining;
    const { speed, speedable } = props.mining;
    const { rows } = props.minting;
    const { token } = props;
    return <React.Fragment>
        <div id='mining'>
            <UiMining
                onToggle={props.mining.onToggle}
                status={status} togglable={togglable}
                onSpeed={props.mining.onSpeed}
                speed={speed[token]} speedable={speedable}
                token={token}
            />
        </div>
        <div id='minting'>
            <UiMinting
                onForget={props.minting.onForget}
                onMint={props.minting.onMint}
                level={ROParams.level.min} rows={rows} token={token}
            />
        </div>
    </React.Fragment>;
}
export default UiHome;
