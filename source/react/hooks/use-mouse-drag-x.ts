import { useMouseDrag } from './use-mouse-drag';
/**
 * @param $ref object to an HTML element
 * @param init x-position (default: 0)
 *
 * @returns a stateful value that measures the x-drag on the provided
 * reference object; and another value for the *per drag* delta.
 */
export function useMouseDragX<T extends HTMLElement & {
    height: number, width: number
}>(
    $ref: React.RefObject<T | null>, init = 0
) {
    return useMouseDrag($ref, init, scaledX)
}
function scaledX(
    e: MouseEvent | TouchEvent, el: HTMLElement & {
        height: number, width: number
    }
) {
    const rect = el.getBoundingClientRect();
    const scale = el.width / rect.width;
    return (clientX(e) - rect.left) * scale;
}
function clientX(
    e: MouseEvent | TouchEvent
) {
    return e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
}
export default useMouseDragX;
