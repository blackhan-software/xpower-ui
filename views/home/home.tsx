import './home.scss';
import { App } from '../../source/app';
import { Level, Token } from '../../source/redux/types';

import React from 'react';
import { UiMining, MinerStatus } from './mining/mining';
export { UiMining, MinerStatus };
import { UiMinting, Minting, MinterRow, MinterStatus } from './minting/minting';
export { UiMinting, Minting, MinterRow, MinterStatus };

type Props = {
    mining: {
        status: MinerStatus | null;
        togglable: boolean;
        onToggle?: (token: Token) => void;
        speed: number;
        speedable: boolean;
        onSpeed?: (token: Token, by: number) => void;
    };
    minting: {
        rows: MinterRow[];
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
                speed={speed} speedable={speedable} token={token}
            />
        </div>
        <div id='minting'>
            <UiMinting
                onForget={props.minting.onForget}
                onMint={props.minting.onMint}
                level={App.level.min} rows={rows} token={token}
            />
        </div>
    </React.Fragment>;
}
export default UiHome;
