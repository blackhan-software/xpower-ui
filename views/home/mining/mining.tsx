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
export class Mining extends React.Component<
    Props
> {
    render() {
        const { status, togglable } = this.props;
        const { speed, speedable } = this.props;
        return <React.Fragment>
            <MiningToggle
                disabled={!togglable} status={status}
                onToggle={this.toggle.bind(this)}
            />
            <MiningSpeed
                disabled={!speedable} speed={speed}
                onSpeed={this.speed.bind(this)}
            />
        </React.Fragment>;
    }
    toggle() {
        if (this.props.onToggle) {
            this.props.onToggle(this.props.token);
        }
    }
    speed(
        by: number
    ) {
        if (this.props.onSpeed) {
            this.props.onSpeed(this.props.token, by);
        }
    }
}
export default Mining;
