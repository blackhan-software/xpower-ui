import React, { Dispatch, SetStateAction, useState } from 'react';
import { App } from '../app';

export const DebugContext = React.createContext<[
    boolean, Dispatch<SetStateAction<boolean>>
]>([
    false, (d) => d
]);
export const DebugProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const [debug, set_debug] = useState<boolean>(App.debug);
    return <DebugContext.Provider value={[debug, set_debug]}>
        {props.children}
    </DebugContext.Provider>;
}
export default DebugContext;
