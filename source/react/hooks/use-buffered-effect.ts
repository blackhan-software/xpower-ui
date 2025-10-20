import { useEffect, useRef } from 'react';

/**
 * A hook that buffers the execution of an effect callback
 * until a certain amount of time has passed without any
 * new dependencies being updated.
 *
 * @param ms delay in milliseconds
 * @param callback effect callback to buffer
 * @param deps optional list of dependencies to watch for
 */
export function useBufferedEffect(
    ms: number,
    callback: React.EffectCallback,
    deps?: React.DependencyList
) {
    const handler = useRef<() => void>(callback);
    const tid = useRef<number | undefined>(
        undefined
    );
    useEffect(() => {
        handler.current = callback;
    }, [
        callback
    ]);
    useEffect(() => {
        clearTimeout(tid.current);
        tid.current = window.setTimeout(
            () => handler.current?.(), ms
        );
        return () => clearTimeout(tid.current);
    }, [
        ms, ...(deps ?? [])
    ]);
}
