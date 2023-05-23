/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/ban-types: [off] */
import { Global } from '../../source/types';
import './about.scss';
declare const global: Global;

import { capitalize } from '../../routes/functions';
import { ensure, link, script } from '../../source/functions';
import { Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

import React, { useContext, useEffect, useState } from 'react';
import { DebugContext } from '../../source/react';

type markdownIt = (options: any) => {
    use: (plugin: any, options?: any) => void;
    render: (markdown: string) => string;
}
type markdownItAnchor = {
    permalink: { linkInsideHeader: Function; };
}
type Props = {
    token: Token;
    url?: URL;
}
export function UiAbout(
    { token, url }: Props
) {
    const $md_content = document.querySelector<HTMLElement>(
        '#md-content'
    );
    const [debug] = useContext(DebugContext);
    const [html, setHtml] = useState(() => {
        return !debug && $md_content ? $md_content.innerHTML : ''
    });
    useEffect(/*set-anchor*/() => {
        const anchor = location.hash;
        scrollToAnchor(anchor);
    }, [html]);
    useEffect(/*fetch-markdown*/() => {
        if (html.length > 0) {
            return;
        }
        const md_url = about_url(url);
        const md = !debug
            ? sessionStorage.getItem(md_url) ?? '' : '';
        if (md.length) {
            renderMarkdown(md, token).then(
                (html) => setHtml(html)
            );
        } else {
            fetchMarkdown(md_url).then((md) => {
                sessionStorage.setItem(md_url, md);
                return renderMarkdown(md, token);
            }).then(
                (html) => setHtml(html)
            );
        }
    }, [
        debug, html, token, url
    ]);
    useEffect(/*render-katex*/() => {
        const $md_content = document.querySelector<HTMLElement>(
            '#md-content'
        );
        if ($md_content) try {
            renderKatex($md_content).then(() => {
                $md_content.classList.remove('d-none');
            });
        } catch (ex) {
            console.error(ex);
        }
    }, [html]);
    return <React.Fragment>
        <div id='md-content' dangerouslySetInnerHTML={{
            __html: html
        }} />
        {Spinner({ show: !html.length })}
    </React.Fragment>;
}
function about_url(
    url?: URL
) {
    if (!url) {
        const $url = document.querySelector<HTMLElement>(
            '#g-urls-about-md'
        );
        if (!$url) {
            throw new Error('#g-urls-about-md missing');
        }
        const url_value = $url.dataset.value;
        if (!url_value) {
            throw new Error('#g-urls-about-md[data-value] missing');
        }
        url = new URL(url_value, location.origin);
    }
    return url.toString();
}
async function fetchMarkdown(
    md_url: string
) {
    const fetched = await fetch(md_url);
    return await fetched.text();
}
async function renderMarkdown(
    content: string, token: Token
) {
    await Promise.all([
        script(SCRIPTS.markdownIt),
        script(SCRIPTS.markdownItAnchor)
    ]);
    const markdownit = await ensure(
        () => global.markdownit as markdownIt, 200, 2000
    );
    const mdi = markdownit({
        html: true, linkify: true, typographer: true
    });
    const anchor = await ensure(
        () => global.markdownItAnchor as markdownItAnchor
    );
    mdi.use(anchor, {
        permalink: anchor.permalink.linkInsideHeader({
            symbol: '¶'
        }),
        level: 2
    });
    const html = mdi.render(
        add_token(fix_katex(content))
    );
    function fix_katex(content: string) {
        return content
            .replace(/\\%/g, '\\\\%')
            .replace(/\\#/g, '\\\\#');
    }
    function add_token(content: string) {
        const token_lc = Tokenizer.lower(token);
        const atoken = Tokenizer.aify(token);
        const atoken_lc = Tokenizer.lower(atoken);
        const xtoken = Tokenizer.xify(token);
        const xtoken_lc = Tokenizer.lower(xtoken);
        return content
            .replace(/{{TOKEN}}/g, token)
            .replace(/{{aTOKEN}}/g, atoken)
            .replace(/{{xTOKEN}}/g, xtoken)
            .replace(/{{token}}/g, token_lc)
            .replace(/{{atoken}}/g, atoken_lc)
            .replace(/{{xtoken}}/g, xtoken_lc)
            .replace(/{{Token}}/g, capitalize(token_lc))
            .replace(/{{aToken}}/g, 'a' + capitalize(token_lc))
            .replace(/{{xToken}}/g, capitalize(xtoken_lc));
    }
    return html;
}
async function renderKatex(
    $content: Element
) {
    await link(STYLES.katex);
    await script(SCRIPTS.katex);
    await script(SCRIPTS.katexAutoRender);
    const render = await ensure(
        () => global.renderMathInElement
    );
    render($content, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
    });
}
function scrollToAnchor(
    anchor: string
) {
    if (anchor) {
        location.hash = '';
        location.hash = anchor;
    }
}
const STYLES = {
    katex: {
        href: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css',
        integrity: 'sha256-uik/hNqHWZldXh/0K35nqOSCff9F61/ZOFReqNOBgB0=',
        crossOrigin: 'anonymous', rel: 'stylesheet'
    }
}
const SCRIPTS = {
    katex: {
        src: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js',
        integrity: 'sha256-6xggdIcWFnTnFwh8MX2xSsGmLa2uzMuAJJnOFzv+tzk=',
        crossOrigin: 'anonymous'
    },
    katexAutoRender: {
        src: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js',
        integrity: 'sha256-y39Mpg7V3D4lhBX4x6O0bUqTV4pSrfgwEfGKfxkOdgI=',
        crossOrigin: 'anonymous'
    },
    markdownIt: {
        src: 'https://cdn.jsdelivr.net/npm/markdown-it@13.0.1/dist/markdown-it.min.js',
        integrity: 'sha256-hNyljag6giCsjv/yKmxK8/VeHzvMDvc5u8AzmRvm1BI=',
        crossOrigin: 'anonymous'
    },
    markdownItAnchor: {
        src: 'https://cdn.jsdelivr.net/npm/markdown-it-anchor@8.6.4/dist/markdownItAnchor.umd.js',
        integrity: 'sha256-is0GToRxOcbAVq2XJvDAs5V0jnjYaKezgbMHdjB2r+E=',
        crossOrigin: 'anonymous'
    }
}
function Spinner(
    props: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm', 'float-start',
        !props.show ? 'd-none' : '', props.grow ? 'spinner-grow' : ''
    ];
    return <span
        className={classes.join(' ')} role='status'
    />;
}
export default UiAbout;
