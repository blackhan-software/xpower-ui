/* eslint @typescript-eslint/no-unused-vars: ["error", {
    "varsIgnorePattern": "^_"
}] */
import { Constructor } from './constructor';
import { DeepPartial } from 'redux';
import { Component } from 'react';
/**
 * @returns inferred property type from a component's constructor
 */
type PropsOf<Ctor>
    = Ctor extends Constructor<Component<infer P>> ? P : never;
/**
 * @returns inferred state type from a component's constructor
 */
type StateOf<Ctor>
    = Ctor extends Constructor<Component<infer _, infer S>> ? S : never;
/**
 * @returns mixin with `update` method
 */
export function Updatable<
    TBase extends Constructor<Component<TProps, TState>>,
    TProps = PropsOf<TBase>, TState = StateOf<TBase>
>(
    Base: TBase
) {
    return class extends Base {
        protected update(
            next_state: DeepPartial<TState>,
            callback?: () => Promise<void>
        ) {
            return new Promise<void>((resolve) => {
                const state = $.extend(
                    true, {}, this.state, next_state
                );
                this.setState(state, async () => {
                    if (typeof callback === 'function') {
                        await callback();
                    }
                    resolve();
                });
            });
        }
    };
}
export default Updatable;
