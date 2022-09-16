import markdownit from 'markdown-it';
import anchor from 'markdown-it-anchor';
import { minify } from 'html-minifier';

export function md_render(
    content: string
) {
    const mdi = markdownit({
        html: true, linkify: true, typographer: true
    });
    mdi.use(anchor, {
        permalink: anchor.permalink.linkInsideHeader({
            symbol: '¶'
        }),
        level: 2
    });
    const html = mdi.render(
        fix_katex(content)
    );
    function fix_katex(content: string) {
        return content
            .replace(/\\%/g, '\\\\%')
            .replace(/\\#/g, '\\\\#');
    }
    return minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeTagWhitespace: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
    });
}
export default md_render;
