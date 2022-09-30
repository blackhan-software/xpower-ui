import './wallet.scss';

import { App } from '../../source/app';
import { globalRef } from '../../source/functions';
import { Address, AftWallet, OtfWallet, Token } from '../../source/redux/types';
import { OtfManager } from '../../source/wallet';

import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { UiAftWallet } from './aft-wallet';
import { UiOtfWallet } from './otf-wallet';

type Props = {
    aft: AftWallet & {
        address: Address | null;
    };
    otf: OtfWallet & {
        onDeposit?: (processing: boolean) => void;
        onWithdraw?: (processing: boolean) => void;
    };
    token: Token;
}
type State = {
    toggled: boolean;
}
export function UiWallet(
    { aft, otf, token }: Props
) {
    const [toggled, set_toggled] = useState<State['toggled']>(
        OtfManager.enabled
    );
    useEffect(() => {
        OtfManager.enabled = toggled;
    }, [toggled]);
    useEffect(() => {
        const handler = OtfManager.onToggled(
            ({ toggled }) => set_toggled(toggled)
        );
        return () => {
            OtfManager.unToggled(handler);
        };
    }, []);
    useEffect(() => {
        App.event.emit('refresh-tips');
    });
    return <>
        <UiAftWallet
            wallet={aft.items} address={aft.address} token={token}
            toggled={toggled} onToggled={(t) => set_toggled(t)}
        ></UiAftWallet>
        <CSSTransition
            nodeRef={globalRef<HTMLElement>('#otf-wallet')}
            in={toggled} timeout={600} classNames='fade-in-600'
        >
            <UiOtfWallet
                address={otf.address}
                amount={otf.amount}
                processing={otf.processing}
                onDeposit={otf.onDeposit}
                onWithdraw={otf.onWithdraw}
                toggled={toggled}
            />
        </CSSTransition>
    </>;
}
export default UiWallet;
