import React, { useEffect, useState } from 'react';
import { useDoubleTap } from './use-double-tap';

export type MouseDrag<T extends HTMLElement> = [
    number, number, React.RefObject<T>
];
/**
 * @param $ref object to an HTML element
 * @param init either an x- or y-position
 * @param xory function for either an x- or y-position
 *
 * @returns a stateful value that measures the drag on the provided
 * reference object; and another value for the *per drag* delta.
 */
export function useMouseDrag<T extends HTMLElement>(
    $ref: React.RefObject<T>, init: number,
    xory: (e: MouseEvent | TouchEvent, el: T) => number,
) {
    const [p, set_p] = useState<number | null>(null);
    const [Δ, set_Δ] = useState(init); // total Δ
    const [δ, set_δ] = useState(0); // per-drag δ
    useDoubleTap($ref, () => {
        set_Δ(0);
        set_δ(0);
    });
    useEffect(() => {
        const el = $ref.current;
        el?.addEventListener('mousedown', mousedown);
        el?.addEventListener('mousemove', mousemove);
        el?.addEventListener('mouseup', mouseup);
        el?.addEventListener('touchstart', mousedown, {
            passive: false
        });
        el?.addEventListener('touchmove', mousemove, {
            passive: false
        });
        el?.addEventListener('touchend', mouseup, {
            passive: false
        });
        return () => {
            el?.removeEventListener('mousedown', mousedown);
            el?.removeEventListener('mousemove', mousemove);
            el?.removeEventListener('mouseup', mouseup);
            el?.removeEventListener('touchstart', mousedown);
            el?.removeEventListener('touchmove', mousemove);
            el?.removeEventListener('touchend', mouseup);
        };
        function mousedown(e: MouseEvent | TouchEvent) {
            set_p(xory(e, el!));
        }
        function mousemove(e: MouseEvent | TouchEvent) {
            if (p !== null) set_δ(p - xory(e, el!));
        }
        function mouseup(_: MouseEvent | TouchEvent) {
            set_Δ((old) => old + δ);
            set_p(null);
            set_δ(0);
        }
    }, [
        p, Δ, δ, $ref, xory
    ]);
    return [Δ + δ, δ, $ref] as MouseDrag<T>;
}
export default useMouseDrag;
