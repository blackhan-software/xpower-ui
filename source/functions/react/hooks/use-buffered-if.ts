/* eslint @typescript-eslint/no-explicit-any: [off] */
import React, { useMemo, useState } from 'react';
import { bufferedIf } from '../../buffered';
/**
 * Returns a stateful value and a *conditionally buffered* function to
 * update it; plus the original setter to instantly update the value.
 *
 * The decision whether to buffer the *invocation* is determined by an
 * auxiliary predicate taking the same arguments for the invocation.
 */
export function useBufferedIf<S>(
    initial: S, iff: (s: S) => any, ms = 200
): [
    S, React.Dispatch<React.SetStateAction<S>>,
    React.Dispatch<React.SetStateAction<S>>
] {
    const [state, set_state_now] = useState(initial);
    const set_state = useMemo(
        () => bufferedIf(set_state_now, iff2(iff), ms),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [set_state_now, ms] // no iff to allow inline functions
    );
    return [state, set_state, set_state_now];
}
const iff2 = <S>(iff: (s: S) => any) => (
    a: React.SetStateAction<S>
) => {
    return callable<(s: S) => S>(a) ? (s: S) => iff(a(s)) : iff(a);
};
const callable = <F>(fn: F | unknown): fn is F => {
    return typeof fn === 'function';
}
export default useBufferedIf;
