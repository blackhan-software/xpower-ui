import './home.scss';
import content from './content.html';

import React from 'react';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

export function UiHome() {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
if (require.main === module) {
    const $ui_home = createElement(UiHome);
    const $content = document.querySelector('content');
    createRoot($content!).render($ui_home);
}
export default UiHome;
