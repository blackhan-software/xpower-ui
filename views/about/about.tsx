/* eslint @typescript-eslint/no-explicit-any: [off] */
/* eslint @typescript-eslint/ban-types: [off] */
import { Global } from '../../source/types';
declare const global: Global;
import './about.scss';

import { App } from '../../source/app';
import { Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { capitalize } from '../../routes/functions';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';

const markdownit = global.markdownit as (options: any) => {
    use: (plugin: any, options?: any) => void,
    render: (markdown: string) => string
};
const anchor = global.markdownItAnchor as {
    permalink: {
        linkInsideHeader: Function
    }
};
type Props = {
    token: Token;
    url?: URL;
}
type State = {
    html: string;
}
export class About extends React.Component<
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
            html: this.renderMarkdown(md, token)
        });
        App.onTokenChanged((token) => this.setState({
            html: this.renderMarkdown(md, token)
        }));
    }
    repaint(
        md: string, token: Token
    ) {
        this.setState({ html: this.renderMarkdown(md, token) });
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
    renderMarkdown(
        content: string, token: Token
    ) {
        const mdi = markdownit({
            html: true, linkify: true, typographer: true
        });
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
        return <div id='md-content' dangerouslySetInnerHTML={{
            __html: this.state.html
        }} />;
    }
    componentDidUpdate() {
        const $content = document.querySelector('#md-content');
        this.renderKatex($content!);
        const anchor = location.hash;
        this.scrollToAnchor(anchor);
    }
    renderKatex(
        $content: Element
    ) {
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
}
if (require.main === module) {
    const $content = document.querySelector('content');
    createRoot($content!).render(createElement(About, {
        token: App.token
    }));
}
export default About;
