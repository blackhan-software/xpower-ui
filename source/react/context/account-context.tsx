import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Blockchain } from '../../blockchain';
import { RWParams } from '../../params';
import { Account } from '../../redux/types';

export const AccountContext = React.createContext<[
    Account | null, Dispatch<SetStateAction<Account | null>>
]>([
    null, (a) => a
]);
export const AccountProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const [account, set_account] = useState<Account | null>(
        RWParams.account
    );
    useEffect(/*init-blockchain-to-account*/() => {
        Blockchain.onceConnect(({ account }) => set_account(account));
    }, []);
    useEffect(/*sync-blockchain-to-account*/() => {
        const on_change = (addresses: string[]) => {
            if (addresses.length) {
                const accounts = addresses.map((a) => BigInt(a));
                const curr_rw = accounts.includes(account ?? 0n);
                if (curr_rw) set_account(BigInt(addresses[0]));
            } else {
                set_account(null); // clear
            }
        };
        Blockchain.provider.then(
            (p) => p?.on('accountsChanged', on_change)
        );
        return () => {
            Blockchain.provider.then(
                (p) => p?.off('accountsChanged', on_change)
            );
        }
    }, [account]);
    useEffect(/*sync-account-to-blockchain*/() => {
        Blockchain.account = account;
    }, [account]);
    return <AccountContext.Provider value={[account, set_account]}>
        {props.children}
    </AccountContext.Provider>;
}
export default AccountContext;
