import './home.scss';
import { App } from '../../source/app';
import { Level, Token } from '../../source/redux/types';

import React from 'react';
import { Mining, MinerStatus } from './mining/mining';
export { Mining, MinerStatus };
import { Minting, MinterRow, MinterStatus } from './minting/minting';
export { Minting, MinterRow, MinterStatus };

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
export class UiHome extends React.Component<
    Props
> {
    render() {
        const { status, togglable } = this.props.mining;
        const { speed, speedable } = this.props.mining;
        const { rows } = this.props.minting;
        const { token } = this.props;
        return <React.Fragment>
            <div id='mining'>
                <Mining
                    onToggle={this.props.mining.onToggle?.bind(this)}
                    status={status} togglable={togglable}
                    onSpeed={this.props.mining.onSpeed?.bind(this)}
                    speed={speed} speedable={speedable} token={token}
                />
            </div>
            <div id='minting'>
                <Minting
                    onForget={this.props.minting.onForget?.bind(this)}
                    onMint={this.props.minting.onMint?.bind(this)}
                    level={App.level.min} rows={rows} token={token}
                />
            </div>
        </React.Fragment>;
    }
}
export default UiHome;
