import './wallet.scss';

import { globalRef } from '../../source/react';
import { Address, AftWallet, Amount, OtfWallet, Token } from '../../source/redux/types';
import { OtfManager } from '../../source/wallet';

import React, { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { UiAftWallet } from './aft-wallet';
import { UiOtfWallet } from './otf-wallet';

type Props = {
    aft: AftWallet & {
        address: Address | null;
        onBurn?: (token: Token, amount: Amount) => void;
    };
    otf: OtfWallet & {
        onToggled?: (toggled: OtfWallet['toggled']) => void;
        onDeposit?: (processing: OtfWallet['processing']) => void;
        onWithdraw?: (processing: OtfWallet['processing']) => void;
    };
    token: Token;
}
export function UiWallet(
    { aft, otf, token }: Props
) {
    const toggled = otf.toggled ?? OtfManager.enabled;
    useEffect(() => {
        OtfManager.enabled = toggled;
    }, [toggled]);
    return <>
        <UiAftWallet
            address={aft.address}
            onBurn={aft.onBurn}
            toggled={toggled}
            token={token}
            onToggled={otf.onToggled}
            wallet={aft}
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
