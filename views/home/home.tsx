import './home.scss';

import { App } from '../../source/app';
import { Level, Token } from '../../source/redux/types';
import { MinerStatus } from '../../source/redux/types';
import { MinterRow } from '../../source/redux/types';

import React, { useEffect } from 'react';
import { UiMining } from './mining/mining';
export { UiMining };
import { UiMinting } from './minting/minting';
export { UiMinting };

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
    useEffect(() => {
        App.event.emit('refresh-tips');
    }, []);
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
