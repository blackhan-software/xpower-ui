import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/store';

export const StateContext = React.createContext<[
    AppState | null
]>([
    null
]);
export const StateProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const app_state = useSelector<AppState, AppState>(s => s);
    return <StateContext.Provider value={[app_state]}>
        {props.children}
    </StateContext.Provider>;
}
export default StateContext;
