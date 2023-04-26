import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Blockchain } from '../../blockchain';
import { Account } from '../../redux/types';

export const AccountContext = React.createContext<[
    Account | null, Dispatch<SetStateAction<Account | null>>
]>([
    null, (a) => a
]);
export const AccountProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const [account, set_account] = useState<Account | null>(null);
    useEffect(() => Blockchain.onceConnect(({ account }) => {
        set_account(account);
    }), []);
    return <AccountContext.Provider value={[account, set_account]}>
        {props.children}
    </AccountContext.Provider>;
}
export default AccountContext;
