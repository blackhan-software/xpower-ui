import { Store } from '@reduxjs/toolkit';
import { Bus } from '../bus';
import { ancestors, buffered } from '../functions';
import { AppState } from '../redux/store';

export const TooltipService = (
    _: Store<AppState>
) => {
    const { Tooltip } = global.bootstrap ?? {
        Tooltip: undefined
    };
    Bus.on('refresh-tips', buffered((
        options: { force?: boolean } | undefined
    ) => {
        const $tips = document.querySelectorAll<HTMLElement>(
            '[data-bs-toggle=tooltip]'
        );
        $tips.forEach(($tip) => {
            if (refresh($tip)) {
                recreate($tip);
                resubscribe($tip);
            }
        });
        function refresh($tip: HTMLElement) {
            return options?.force || $tip.title.length > 0;
        }
        function recreate($tip: HTMLElement) {
            Tooltip.getInstance($tip)?.dispose();
            Tooltip.getOrCreateInstance($tip);
        }
        function resubscribe($tip: HTMLElement) {
            $tip.addEventListener('shown.bs.tooltip', ({
                target
            }) => {
                target?.removeEventListener('click', show);
                target?.addEventListener('click', hide, {
                    once: true
                });
            });
        }
    }));
    function show(e: Event) {
        const $tip = $tooltip(e.target as HTMLElement | null);
        Tooltip.getInstance($tip)?.show();
    }
    function hide(e: Event) {
        const $tip = $tooltip(e.target as HTMLElement | null);
        Tooltip.getInstance($tip)?.hide();
    }
    function $tooltip($target: HTMLElement | null) {
        const [$tip] = ancestors($target, ($el) => {
            const a = $el.getAttribute('data-bs-toggle');
            return a === 'tooltip';
        });
        return $tip ?? $target;
    }
};
export default TooltipService;
