import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { Params } from '../../params';
import { Page, State } from '../types';

export type OnPageSwitch = (
    next: Page, prev: Page
) => void;

export function onPageSwitch(
    store: Store<State, AnyAction>, handler: OnPageSwitch
): Unsubscribe {
    const selector = (state: State) => state.page;
    const observer = observe<Page>(store)(
        selector, Params.page
    );
    return observer(handler);
}
