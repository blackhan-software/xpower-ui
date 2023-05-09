import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { AppState } from '../store';
import { PptFlags } from '../types';

export type OnPptsUiFlags = (
    next: PptFlags, prev: PptFlags
) => void;

export function onPptsUiFlags(
    store: Store<AppState, AnyAction>,
    handler: OnPptsUiFlags
): Unsubscribe {
    const selector = (state: AppState) => state.ppts_ui.flags;
    const observer = observe<PptFlags>(store)(
        selector, {} as PptFlags
    );
    return observer(handler);
}
