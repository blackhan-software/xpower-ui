/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/ban-types: [off] */
import { Global } from '../../source/types';
declare const global: Global;
import './about.scss';

import { Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { capitalize } from '../../routes/functions';
import { link, script } from '../../source/functions';

import React from 'react';

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
type State = {
    html: string;
}
export class UiAbout extends React.Component<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            html: ''
        };
        this.events(props);
    }
    async events(
        { url, token }: Props
    ) {
        const md = await this.fetchMarkdown(url);
        this.setState({
            html: await this.renderMarkdown(md, token)
        });
    }
    async fetchMarkdown(
        url?: URL
    ) {
        if (!url) {
            const $about_url = document.querySelector<HTMLElement>(
                '#g-urls-about'
            );
            if (!$about_url) {
                throw new Error('#g-urls-about missing');
            }
            const about_url = $about_url.dataset.value;
            if (!about_url) {
                throw new Error('#g-urls-about[data-value] missing');
            }
            url = new URL(about_url, location.origin);
        }
        const fetched = await fetch(url.toString());
        return await fetched.text();
    }
    async renderMarkdown(
        content: string, token: Token
    ) {
        await script(this.scripts.markdownIt);
        const markdownit = global.markdownit as markdownIt;
        const mdi = markdownit({
            html: true, linkify: true, typographer: true
        });
        await script(this.scripts.markdownItAnchor);
        const anchor = global.markdownItAnchor as markdownItAnchor;
        mdi.use(anchor, {
            permalink: anchor.permalink.linkInsideHeader({
                symbol: '¶', ariaHidden: true
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
            return content
                .replace(/{{TOKEN}}/g, token)
                .replace(/{{token}}/g, token_lc)
                .replace(/{{Token}}/g, capitalize(token_lc));
        }
        return html;
    }
    render() {
        const { html } = this.state;
        return <React.Fragment>
            {Spinner({ show: !html })}
            {this.$mdContent(html)}
        </React.Fragment >;
    }
    $mdContent(
        html: string
    ) {
        return <div id='md-content' dangerouslySetInnerHTML={{
            __html: html
        }} />;
    }
    componentDidUpdate() {
        const $content = document.querySelector(
            '#md-content'
        );
        this.renderKatex($content!);
        const anchor = location.hash;
        this.scrollToAnchor(anchor);
    }
    async renderKatex(
        $content: Element
    ) {
        await link(this.styles.katex);
        await script(this.scripts.katex);
        await script(this.scripts.katexAutoRender);
        global.renderMathInElement($content, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false
        });
    }
    scrollToAnchor(
        anchor: string
    ) {
        if (anchor) {
            location.hash = '';
            location.hash = anchor;
        }
    }
    styles = {
        katex: {
            href: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css',
            integrity: 'sha256-uik/hNqHWZldXh/0K35nqOSCff9F61/ZOFReqNOBgB0=',
            crossOrigin: 'anonymous', rel: 'stylesheet'
        }
    }
    scripts = {
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
}
function Spinner(
    state: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm', 'float-start',
        !state.show ? 'd-none' : '', state.grow ? 'spinner-grow' : ''
    ];
    return <span
        className={classes.join(' ')}
        role='status' style={{
            height: '2rem',
            left: 'calc(50% - 1rem)',
            position: 'absolute',
            top: 'calc(50% - 1rem)',
            width: '2rem',
        }}
    />;
}
export default UiAbout;
