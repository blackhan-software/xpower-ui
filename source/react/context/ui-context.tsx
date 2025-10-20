import React, { JSX } from 'react';
import { useSelector } from 'react-redux';
import { uiOf } from '../../redux/selectors';
import { AppState } from '../../redux/store';
import { Ui } from '../../redux/types';

export const UiContext = React.createContext<[
    Ui | null
]>([
    null
]);
export const UiProvider = (
    props: { children: JSX.Element | JSX.Element[] }
) => {
    const ui = useSelector<AppState, Ui>(uiOf);
    return <UiContext.Provider value={[ui]}>
        {props.children}
    </UiContext.Provider>;
}
export default UiContext;
