import React, { useEffect, useState } from 'react';
/**
 * @param $ref object to an HTML element to wheel on
 * @param Δ-values w.r.t. CTRL and SHIFT modifiers
 * @param init value
 *
 * @returns stateful value measuring wheel position.
 */
export function useWheel<T extends HTMLElement>(
    $ref: React.RefObject<T>, Δ = [1], init = 0
): [
    number, React.RefObject<T>
] {
    const [value, set_value] = useState(init);
    useEffect(() => {
        const el = $ref.current;
        el?.addEventListener('wheel', decrease, {
            passive: false
        });
        el?.addEventListener('wheel', increase, {
            passive: false
        });
        return () => {
            el?.removeEventListener('wheel', decrease);
            el?.removeEventListener('wheel', increase);
        };
        function decrease(e: WheelEvent) {
            e.preventDefault();
            e.stopPropagation();
            if (e.deltaY > 0) {
                set_value(value - delta(Δ, e));
            }
        }
        function increase(e: WheelEvent) {
            e.preventDefault();
            e.stopPropagation();
            if (e.deltaY < 0) {
                set_value(value + delta(Δ, e));
            }
        }
    }, [
        value, $ref, Δ
    ]);
    return [value, $ref];
}
function delta(
    Δ: number[], e: { ctrlKey: boolean; shiftKey: boolean; }
) {
    if (Δ.length >= 3) {
        return e.ctrlKey ? Δ[2] : e.shiftKey ? Δ[1] : Δ[0];
    }
    if (Δ.length >= 2) {
        return e.ctrlKey || e.shiftKey ? Δ[1] : Δ[0];
    }
    return Δ[0] ?? 1;
}
export default useWheel;
