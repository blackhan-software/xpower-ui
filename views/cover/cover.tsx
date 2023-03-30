import './cover.scss';

import React from 'react';
import { MinerStatus, Page, Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

type Props = {
    page: Page;
    token: Token;
    status: MinerStatus | null;
}
export function UiCover(
    { page, token, status }: Props
) {
    switch (page) {
        case Page.Home:
        case Page.Nfts:
        case Page.Ppts:
            return <div id='cover'>{$image({ token, status })}</div>;
        default:
            return null;
    }
}
function $image(
    { token, status }: Pick<Props, 'token' | 'status'>
) {
    const pulsate = (status: Props['status']) => {
        switch (status) {
            case MinerStatus.stopping:
            case MinerStatus.started:
            case MinerStatus.pausing:
                return 'pulsate';
        }
        return undefined;
    };
    const power = Tokenizer.aified(token)
        ? 'apower' : 'xpower';
    return <img className={pulsate(status)}
        src={`/images/jpg/cover-${power}.jpg`}
        id='cover' width="736" height="246"
    ></img>;
}
