export function next<
    TElement extends HTMLElement
>(
    e?: TElement | null,
    filter?: (e: HTMLElement) => boolean
) {
    e = e?.nextElementSibling as TElement | null;
    while (e && filter && !filter(e)) {
        e = e.nextElementSibling as TElement | null;
    }
    return e;
}
export default next;
