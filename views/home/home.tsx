import './home.scss';

import content from './content.html';
import Mine from '../../public/images/jpg/desktop-mine.jpg';
import Nfts from '../../public/images/jpg/desktop-nfts.jpg';
import Ppts from '../../public/images/jpg/desktop-ppts.jpg';
import Swap from '../../public/images/jpg/desktop-swap.jpg';

import React from 'react';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

export function UiHome() {
    let html = content;
    html = html.replace(/{{DESKTOP_MINE}}/g, Mine);
    html = html.replace(/{{DESKTOP_NFTS}}/g, Nfts);
    html = html.replace(/{{DESKTOP_PPTS}}/g, Ppts);
    html = html.replace(/{{DESKTOP_SWAP}}/g, Swap);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
if (require.main === module) {
    const $ui_home = createElement(UiHome);
    const $content = document.querySelector('content');
    createRoot($content!).render($ui_home);
}
export default UiHome;
