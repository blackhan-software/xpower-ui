import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Blockchain } from '../blockchain';
import { Address } from '../redux/types';

export const AddressContext = React.createContext<[
    Address | null, Dispatch<SetStateAction<Address | null>>
]>([
    null, (a) => a
]);
export const AddressProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const [address, set_address] = useState<Address | null>(null);
    useEffect(() => Blockchain.onceConnect(({ address }) => {
        set_address(address);
    }), []);
    return <AddressContext.Provider value={[address, set_address]}>
        {props.children}
    </AddressContext.Provider>;
}
export default AddressContext;
