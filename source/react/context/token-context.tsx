import React, { Dispatch, SetStateAction, useEffect, useState, JSX } from 'react';
import { Blockchain } from '../../blockchain';
import { RWParams } from '../../params';
import { Token } from '../../redux/types';

export const TokenContext = React.createContext<[
    Token, Dispatch<SetStateAction<Token>>
]>([
    RWParams.token, (a) => a
]);
export const TokenProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const [token, set_token] = useState<Token>(RWParams.token);
    useEffect(() => Blockchain.onConnect(({ token }) => {
        set_token(token);
    }), []);
    return <TokenContext.Provider value={[token, set_token]}>
        {props.children}
    </TokenContext.Provider>;
}
export default TokenContext;
