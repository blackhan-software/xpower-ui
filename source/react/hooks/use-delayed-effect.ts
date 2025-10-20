import { useEffect, useRef } from 'react';
/**
 * A hook that delays the execution of an effect callback.
 *
 * @param ms delay in milliseconds
 * @param callback effect callback to delay
 * @param deps optional list of dependencies to watch for
 */
export function useDelayedEffect(
    ms: number,
    callback: React.EffectCallback,
    deps?: React.DependencyList
) {
    const handler = useRef<(() => void) | undefined>(
        undefined
    );
    useEffect(() => {
        handler.current = callback;
    }, [
        callback
    ]);
    useEffect(() => {
        const tid = setTimeout(
            () => handler.current?.(), ms
        );
        return () => clearTimeout(tid);
    }, [
        ms, ...(deps ?? [])
    ]);
}
export default useDelayedEffect;
