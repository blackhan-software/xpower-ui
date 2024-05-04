import { useEffect, useRef } from 'react';

export interface OnDoubleTap {
    (e: MouseEvent | TouchEvent): void
}
export function useDoubleTap<T extends HTMLElement>(
    $ref: React.RefObject<T>, handler: OnDoubleTap, ms = 200
): [
    React.RefObject<T>
] {
    const time = useRef<number>(0);
    useEffect(() => {
        const el = $ref.current;
        el?.addEventListener('touchstart', touchstart, {
            passive: true
        });
        el?.addEventListener('dblclick', handler);
        return () => {
            el?.removeEventListener('touchstart', touchstart);
            el?.removeEventListener('dblclick', handler);
        };
        function touchstart(e: TouchEvent) {
            const now = Date.now();
            if (time.current - now < -ms) {
                time.current = now;
            } else {
                handler(e);
            }
        }
    }, [
        $ref, handler, ms
    ]);
    return [$ref];
}
export default useDoubleTap;
