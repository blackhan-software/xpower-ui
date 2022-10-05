import React, { Dispatch, SetStateAction, useState } from 'react';
import { Params } from '../params';

export const DebugContext = React.createContext<[
    boolean, Dispatch<SetStateAction<boolean>>
]>([
    false, (d) => d
]);
export const DebugProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const [debug, set_debug] = useState<boolean>(Params.debug);
    return <DebugContext.Provider value={[debug, set_debug]}>
        {props.children}
    </DebugContext.Provider>;
}
export default DebugContext;
