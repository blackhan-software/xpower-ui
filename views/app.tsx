import React, { Suspense, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, connect } from 'react-redux';
import Store, { AppState } from '../source/redux/store';
import { Page } from '../source/redux/types';

const UiHome = React.memo(React.lazy(() => import('./home/home')));
const UiRest = React.memo(React.lazy(() => import('./spa/spa')));

type Props = {
    page: Page
}
export function App(
    { page }: Props
) {
    switch (page) {
        case Page.Home:
            return <Suspense><UiHome /></Suspense>;
        default:
            return <Suspense><UiRest /></Suspense>;
    }
}
if (require.main === module) {
    const mapper = ({ page }: AppState) => ({ page });
    const $app = createElement(connect(mapper)(App));
    const $content = document.querySelector('content');
    createRoot($content!).render(
        <Provider store={Store()}>{$app}</Provider>
    );
}
export default App;
