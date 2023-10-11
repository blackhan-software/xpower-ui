import React from 'react';
import { useSelector } from 'react-redux';
import { walletOf } from '../../redux/selectors';
import { AppState } from '../../redux/store';
import { Wallet } from '../../redux/types';

export const WalletContext = React.createContext<[
    Wallet | null
]>([
    null
]);
export const WalletProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const wallet = useSelector<AppState, Wallet>(walletOf);
    return <WalletContext.Provider value={[wallet]}>
        {props.children}
    </WalletContext.Provider>;
}
export default WalletContext;
