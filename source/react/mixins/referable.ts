import { Constructor } from './constructor';
import React, { RefObject } from 'react';
/**
 * @info global map of name to reference objects
 */
let global_refs: Record<string, RefObject<unknown>> | undefined;
/**
 * @returns mixin with the `globalRef` and `ref` methods
 */
export function Referable<
    TBase extends Constructor<React.Component>,
    U = unknown
>(
    Base: TBase
) {
    return class Ref extends Base {
        protected globalRef<T extends U>(
            name: string
        ) {
            if (global_refs === undefined) {
                global_refs = {};
            }
            if (global_refs[name] === undefined) {
                global_refs[name] = React.createRef<T>();
            }
            return global_refs[name] as RefObject<T>;
        }
        protected ref<T extends U>(
            name: string
        ) {
            if (this._refs[name] === undefined) {
                this._refs[name] = React.createRef<T>();
            }
            return this._refs[name] as RefObject<T>;
        }
        private _refs: Record<string, RefObject<U | null>> = {};
    };
}
/**
 * @returns a global reference object
 */
export function globalRef<T = unknown>(
    name: string
) {
    if (global_refs === undefined) {
        global_refs = {};
    }
    if (global_refs[name] === undefined) {
        global_refs[name] = React.createRef<T>();
    }
    return global_refs[name] as RefObject<T>;
}
export default Referable;
