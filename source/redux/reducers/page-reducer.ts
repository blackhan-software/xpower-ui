import { App } from '../../app';

import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { Page } from '../types';

export function pageReducer(
    page: Page = pageState(), action: Action
): Page {
    if (actions.switchPage.match(action)) {
        return action.payload.page;
    }
    return page;
}
export function pageState() {
    return App.page;
}
export default pageReducer;
