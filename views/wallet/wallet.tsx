import './wallet.scss';

import { App } from '../../source/app';
import { globalRef } from '../../source/functions';
import { Address, Amount, Token, Wallet } from '../../source/redux/types';
import { OtfWallet } from '../../source/wallet';

import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { UiAftWallet } from './aft-wallet';
import { UiOtfWallet } from './otf-wallet';

type Props = {
    aft: {
        address: Address | null;
    };
    otf: {
        address: Address | null;
        amount: Amount | null;
        processing: boolean;
    } & {
        onDeposit?: (processing: boolean) => void;
        onWithdraw?: (processing: boolean) => void;
    };
    token: Token;
    wallet: Wallet;
}
type State = {
    toggled: boolean;
}
export function UiWallet(
    { aft, otf, token, wallet }: Props
) {
    const [toggled, set_toggled] = useState<State['toggled']>(
        OtfWallet.enabled
    );
    useEffect(() => {
        OtfWallet.enabled = toggled;
    }, [toggled]);
    useEffect(() => {
        const handler = OtfWallet.onToggled(
            ({ toggled }) => set_toggled(toggled)
        );
        return () => {
            OtfWallet.unToggled(handler);
        };
    }, []);
    useEffect(() => {
        App.event.emit('refresh-tips');
    });
    return <>
        <UiAftWallet
            address={aft.address} token={token} wallet={wallet}
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
