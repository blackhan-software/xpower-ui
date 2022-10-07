import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { Params } from '../../params';
import { AppState } from '../store';
import { Page } from '../types';

export type OnPageSwitch = (
    next: Page, prev: Page
) => void;

export function onPageSwitch(
    store: Store<AppState, AnyAction>, handler: OnPageSwitch
): Unsubscribe {
    const selector = (state: AppState) => state.page;
    const observer = observe<Page>(store)(
        selector, Params.page
    );
    return observer(handler);
}
