/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../source/types';
declare const global: Global;

const { Tooltip } = global.bootstrap as any;

$(window).on('load', function toggleTooltips() {
    const $tips = $('[data-bs-toggle="tooltip"]');
    $tips.map((_, el) => Tooltip.getOrCreateInstance(el));
    $tips.on('shown.bs.tooltip', (ev) => {
        $(ev.target).one('click', hide).off('click', show);
    });
    $tips.on('hidden.bs.tooltip', (ev) => {
        $(ev.target).off('click', hide).one('click', show);
    });
});
function hide(ev: JQuery.ClickEvent) {
    Tooltip.getOrCreateInstance($tip($(ev.target)))?.hide();
}
function show(ev: JQuery.ClickEvent) {
    Tooltip.getOrCreateInstance($tip($(ev.target)))?.show();
}
function $tip($el: JQuery<HTMLElement>) {
    const $tt = $el.parents(`[data-bs-toggle="tooltip"]`);
    return $tt.length ? $tt : $el;
}
