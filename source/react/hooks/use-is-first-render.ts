import { useRef } from 'react';

export function useIsFirstRender() {
    const is_first = useRef(true);
    if (is_first.current) {
        is_first.current = false;
        return true;
    }
    return is_first.current;
}
export default useIsFirstRender;
