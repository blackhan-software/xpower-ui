import { useMouseDrag } from './use-mouse-drag';
/**
 * @param $ref object to an HTML element
 * @param init y-position (default: 0)
 *
 * @returns a stateful value that measures the y-drag on the provided
 * reference object; and another value for the *per drag* delta.
 */
export function useMouseDragY<T extends HTMLElement & {
    height: number, width: number
}>(
    $ref: React.RefObject<T>, init = 0
) {
    return useMouseDrag($ref, init, scaledY)
}
function scaledY(
    e: MouseEvent | TouchEvent, el: HTMLElement & {
        height: number, width: number
    }
) {
    const rect = el.getBoundingClientRect();
    const scale = el.height / rect.height;
    return (clientY(e) - rect.top) * scale;
}
function clientY(
    e: MouseEvent | TouchEvent
) {
    return e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
}
export default useMouseDragY;
