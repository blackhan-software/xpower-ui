import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MYProviderUrl, MYProviderMs } from '../../blockchain';

export type Rpc = Partial<{
    url: string;
    ms: number;
}>
export const RpcContext = React.createContext<[
    Rpc | null, Dispatch<SetStateAction<Rpc | null>>
]>([
    null, (a) => a
]);
export const RpcProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const [rpc, set_rpc] = useState<Rpc | null>(
        null
    );
    useEffect(/*init-rpc-address*/() => {
        const url = MYProviderUrl();
        const ms = MYProviderMs();
        if (url) {
            const uri = new URL(url);
            const code = uri.searchParams.get('code-x');
            if (code && code.match(/^0x[0-9a-f]{8}$/)) {
                uri.searchParams.delete('code-x');
            }
            set_rpc({ url: uri.toString(), ms });
        } else {
            set_rpc({ url, ms });
        }
    }, []);
    useEffect(/*sync-rpc-address*/() => {
        if (rpc && typeof rpc.url === 'string') {
            localStorage.setItem('g-rpc-address', rpc.url);
        } else {
            localStorage.removeItem('g-rpc-address');
        }
        if (rpc && typeof rpc.ms === 'number') {
            localStorage.setItem('g-rpc-polling', `${rpc.ms}`);
        } else {
            localStorage.removeItem('g-rpc-polling');
        }
    }, [rpc]);
    return <RpcContext.Provider value={[rpc, set_rpc]}>
        {props.children}
    </RpcContext.Provider>;
}
export default RpcContext;
