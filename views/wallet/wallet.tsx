import './wallet.scss';

import { globalRef } from '../../source/react';
import { Account, Address, AftWallet, Amount, OtfWallet, Token } from '../../source/redux/types';
import { OtfManager } from '../../source/wallet';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { AvvyDomainsFactory } from '../../source/contract';
import { UiAftWallet } from './aft-wallet';
import { UiOtfWallet } from './otf-wallet';
import { x40 } from '../../source/functions';

type Props = {
    aft: AftWallet & {
        account: Account | null;
        set_account: Dispatch<SetStateAction<Account | null>>;
        accounts: Account[];
        onBurn?: (token: Token, amount: Amount) => void;
    };
    otf: OtfWallet & {
        onToggled?: (
            toggled: OtfWallet['toggled']
        ) => void;
        onDeposit?: (
            processing: OtfWallet['processing'],
            amount: OtfWallet['amount']
        ) => void;
        onWithdraw?: (
            processing: OtfWallet['processing']
        ) => void;
    };
}
export function UiWallet(
    { aft, otf }: Props
) {
    const toggled = otf.toggled ?? OtfManager.enabled;
    useEffect(() => {
        OtfManager.enabled = toggled;
    }, [toggled]);
    const [names, set_names] = useState<Record<Address, string>>({});
    useEffect(() => {
        resolve([...aft.accounts, aft.account ?? 0n]).then(set_names);
    }, [
        aft.accounts, aft.account
    ]);
    return <>
        <UiAftWallet
            account={aft.account}
            set_account={aft.set_account}
            accounts={aft.accounts}
            names={names}
            onBurn={aft.onBurn}
            toggled={toggled}
            onToggled={otf.onToggled}
            wallet={aft}
        ></UiAftWallet>
        <CSSTransition
            nodeRef={globalRef<HTMLElement>('#otf-wallet')}
            in={toggled} timeout={600} classNames='fade-in-600'
        >
            <UiOtfWallet
                account={otf.account}
                amount={otf.amount}
                processing={otf.processing}
                onDeposit={otf.onDeposit}
                onWithdraw={otf.onWithdraw}
                toggled={toggled}
            />
        </CSSTransition>
    </>;
}
async function resolve(
    accounts: Account[]
): Promise<Record<Address, string>> {
    const ado = AvvyDomainsFactory();
    const names = await Promise.all(accounts.map(
        (a) => ado.reverseResolveEVMToName(a)
    ));
    const result = {} as Record<Address, string>;
    accounts.map(x40).forEach((a, i) => {
        result[a] = names[i];
    });
    return result;
}
export default UiWallet;
