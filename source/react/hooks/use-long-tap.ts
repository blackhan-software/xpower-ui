import { useState, useEffect, useCallback, useRef } from 'react';

export interface OnLongTap {
    (e?: MouseEvent | TouchEvent): void
}
export function useLongTap<T extends HTMLElement | null>(
    $ref: React.RefObject<T>, handler: OnLongTap, ms = 900
): [
    boolean, (flag: boolean) => void
] {
    const timer = useRef<NodeJS.Timeout | undefined>(
        undefined
    );
    const [stamp, set_stamp] = useState(0);
    const tapped = useRef<boolean>(false);
    const start = useCallback(() => {
        timer.current = setTimeout(() => {
            if (performance.now() - stamp >= ms) {
                tapped.current = true;
                handler(undefined);
            }
        }, ms);
        tapped.current = false;
        set_stamp(performance.now());
    }, [
        handler, stamp, ms
    ]);
    const end = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
        }
        setTimeout(() => {
            tapped.current = false;
        });
        set_stamp(0);
    }, []);
    useEffect(() => {
        const el = $ref.current;
        el?.addEventListener('mousedown', start);
        el?.addEventListener('mouseup', end);
        el?.addEventListener('touchstart', start, {
            passive: true
        });
        el?.addEventListener('touchend', end);
        return () => {
            el?.removeEventListener('mousedown', start);
            el?.removeEventListener('mouseup', end);
            el?.removeEventListener('touchstart', start);
            el?.removeEventListener('touchend', end);
        };
    }, [
        $ref, start, end
    ]);
    return [
        tapped.current, (flag) => tapped.current = flag
    ];
}

export default useLongTap;
