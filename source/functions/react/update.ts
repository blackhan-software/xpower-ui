import { Component } from 'react';
import { DeepPartial } from 'redux';

export function update<S>(
    this: Component,
    next_state: DeepPartial<S>,
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
export default update;
