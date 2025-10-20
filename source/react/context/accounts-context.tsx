import React, { Dispatch, SetStateAction, useEffect, useState, JSX } from 'react';
import { Blockchain } from '../../blockchain';
import { Account } from '../../redux/types';

export const AccountsContext = React.createContext<[
    Account[], Dispatch<SetStateAction<Account[]>>
]>([
    [], (a) => a
]);
export const AccountsProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const [accounts, set_accounts] = useState<Account[]>([]);
    useEffect(/*init-blockchain-to-accounts*/() => {
        Blockchain.onceConnect(({ accounts }) => set_accounts(accounts));
    }, []);
    useEffect(/*sync-blockchain-to-accounts*/() => {
        const on_change = (addresses: string[]) => {
            set_accounts(addresses.map((a) => BigInt(a)));
        };
        Blockchain.provider.then(
            (p) => p?.on('accountsChanged', on_change)
        );
        return () => {
            Blockchain.provider.then(
                (p) => p?.off('accountsChanged', on_change)
            );
        }
    }, []);
    return <AccountsContext.Provider value={[accounts, set_accounts]}>
        {props.children}
    </AccountsContext.Provider>;
}
export default AccountsContext;
