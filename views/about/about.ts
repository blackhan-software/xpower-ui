/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/ban-types: [off] */
import './about.scss';

import { Global } from '../../source/types';
declare const global: Global;

const markdownit = global.markdownit as (options: any) => {
    use: (plugin: any, options?: any) => void,
    render: (markdown: string) => string
};
const anchor = global.markdownItAnchor as {
    permalink: {
        linkInsideHeader: Function
    }
};
/**
 * Render content text with markdown-it:
 */
$(window).on('load', async () => {
    const mdi = markdownit({
        html: true, linkify: true, typographer: true
    });
    mdi.use(anchor, {
        permalink: anchor.permalink.linkInsideHeader({
            symbol: '¶', ariaHidden: true
        }),
        level: 2
    });
    const about_url = $('#g-urls-about').data('value');
    const fetched = await fetch(about_url);
    const content = await fetched.text();
    const html = mdi.render(content
        .replace(/\\%/g, '\\\\%')
        .replace(/\\#/g, '\\\\#')
    );
    $('content').html(html).trigger('ready');
});
/**
 * Scroll to anchor (if present)
 */
$('content').on('ready', () => {
    const anchor = location.hash;
    if (anchor) {
        location.hash = '';
        location.hash = anchor;
    }
});
/**
 * Render content formulae with KaTex:
 */
 $('content').on('ready', (ev) => {
    global.renderMathInElement(ev.target, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
    });
});
