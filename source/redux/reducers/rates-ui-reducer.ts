import { NftToken, NftTokens, RatesUi } from '../types';
import { Refresher } from '../types/rates-ui';

import { Action } from '@reduxjs/toolkit';
import * as actions from '../actions';

export function ratesUiReducer(
    rates_ui: RatesUi = ratesUiState(), action: Action
): RatesUi {
    if (actions.setRatesUiRefresher.match(action)) {
        const { refresher: rhs } = action.payload;
        const { refresher: lhs } = rates_ui;
        return {
            ...rates_ui, refresher: $.extend(true, {}, lhs, rhs)
        };
    }
    if (actions.setRatesUi.match(action)) {
        return $.extend(true, {}, rates_ui, action.payload);
    }
    return rates_ui;
}
export function ratesUiState() {
    return {
        refresher: refresher(),
    };
}
function refresher() {
    return wrap({ status: null } as Refresher);
}
function wrap<WR extends Record<string, unknown>>(
    wrapped_record: WR
) {
    const entries = Object.fromEntries(
        Array.from(NftTokens()).map((t) => [t, wrapped_record])
    );
    return entries as Record<NftToken, WR>;
}
export default ratesUiReducer;
