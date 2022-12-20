/* eslint @typescript-eslint/no-unused-vars: [off] */
interface JQuery {
    ing: (options?: Partial<{
        ing: string,
        spin: boolean,
        suffix: RegExp | null,
    }>) => (() => void);
}
(function ing_plugin(jquery: typeof jQuery) {
    jquery.fn.ing = function (
        { ing, spin, suffix } = { ing: 'ing', spin: false, suffix: /[aeiou]/ }
    ) {
        if (ing === undefined) {
            ing = 'ing';
        }
        if (spin === undefined) {
            spin = false;
        }
        if (suffix === undefined) {
            suffix = /[aeiou]/;
        }
        const sfx = new RegExp(
            suffix ? `(${ing}|${suffix.source})…?$` : `${ing}…?$`
        );
        const prepare = () => {
            if (!this.find('.text').length) {
                this.html(`<span class="text">${this.text()}</span>`);
            }
            if (!this.find('.spinner').length) {
                const classes = [
                    "spinner",
                    "spinner-border",
                    "spinner-border-sm",
                ];
                if (!spin) {
                    classes.push("spinner-grow");
                }
                const style = {
                    'display': 'none',
                    'height': '1em',
                    'left': '0.75em',
                    'margin-top': '0.25em',
                    'position': 'absolute',
                    'width': '1em',
                };
                const styles = Object.entries(style)
                    .map(([k, v]) => `${k}:${v}`);
                this.prepend($(`<span` +
                    ` role="status"` +
                    ` class="${classes.join(' ')}"` +
                    ` style="${styles.join(';')}"` +
                    `/>`
                ));
            }
            return apply();
        };
        const apply = () => {
            const text = this.find('.text').text();
            const [head, ...rest] = text.split(/\s/);
            let head_new = head.match(sfx)
                ? head.replace(sfx, ing!)
                : head + ing!;
            const tail = rest.pop();
            if (tail) {
                rest.push(tail + (!tail.endsWith('…') ? '…' : ''));
            } else {
                head_new += '…';
            }
            this.prop('disabled', true);
            this.find('.spinner').show();
            this.find('.text').text(
                [head_new, ...rest].join(' ')
            );
            return reset(
                (head.match(sfx) ?? [''])[0]
            );
        };
        const reset = (suffix: string) => () => {
            const text = this.find('.text').text();
            const [head, ...rest] = text.split(/\s/);
            const head_new = head.replace(
                sfx, suffix.replace(/…$/, '')
            );
            const tail = rest.pop();
            if (tail) {
                rest.push(tail.replace(/…$/, ''));
            }
            this.prop('disabled', false);
            this.find('.spinner').hide();
            this.find('.text').text(
                [head_new, ...rest].join(' ')
            );
        };
        const all_reset = this.map(function () { return prepare(); });
        return () => all_reset.toArray().forEach((reset) => reset());
    };
}(jQuery));
