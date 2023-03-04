import React, { Dispatch, SetStateAction, useState } from 'react';
import { ROParams } from '../../params';

export const DebugContext = React.createContext<[
    number, Dispatch<SetStateAction<number>>
]>([
    0, (d) => d
]);
export const DebugProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const [debug, set_debug] = useState<number>(ROParams.debug);
    return <DebugContext.Provider value={[debug, set_debug]}>
        {props.children}
    </DebugContext.Provider>;
}
export default DebugContext;
