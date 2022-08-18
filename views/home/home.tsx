import './home.scss';

import { App } from '../../source/app';
import { Token } from '../../source/redux/types';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';
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
if (require.main === module) {
    const $content = document.querySelector('content');
    createRoot($content!).render(createElement(UiHome, {
        token: App.token, speed: App.speed
    }));
}
export default UiHome;
