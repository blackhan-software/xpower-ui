
import { Action } from '@reduxjs/toolkit';
import { Params } from '../../params';
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
    return Params.page;
}
export default pageReducer;
