import './home.scss';
import { Token } from '../../source/redux/types';

import React from 'react';
import { Mining } from './mining/mining';
import { Minting } from './minting/minting';

type Props = {
    token: Token;
    speed: number;
}
export class UiHome extends React.Component<
    Props
> {
    render() {
        const { token, speed } = this.props;
        return <React.Fragment>
            <div id='mining'>
                <Mining token={token} speed={speed} />
            </div>
            <div id='minting'>
                <Minting token={token} />
            </div>
        </React.Fragment>;
    }
}
export default UiHome;
