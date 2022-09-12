import { Constructor } from './constructor';
import React, { RefObject } from 'react';
/**
 * @info global map of name to ref-objects
 */
let global_refs: Record<string, RefObject<unknown>> | undefined;
/**
 * @returns mixin with `[global_]ref` methods
 */
export function Referable<
    TBase extends Constructor<React.Component>,
    U = unknown
>(
    Base: TBase
) {
    return class Ref extends Base {
        protected global_ref<T extends U>(
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
        private _refs: Record<string, RefObject<U>> = {};
    };
}
/**
 * @returns a global reference object
 */
export function global_ref<T = unknown>(
    name: string
)  {
    if (global_refs === undefined) {
        global_refs = {};
    }
    if (global_refs[name] === undefined) {
        global_refs[name] = React.createRef<T>();
    }
    return global_refs[name] as RefObject<T>;
}
export default Referable;
