import { createAction } from '@reduxjs/toolkit';
import { DeepPartial, RatesUi } from '../types';

export const setRatesUiRefresher = createAction('rates:ui/set-refresher', (
    rates_ui: DeepPartial<Pick<RatesUi, 'refresher'>>
) => ({
    payload: rates_ui
}));
export const setRatesUi = createAction('rates:ui/set', (
    rates_ui: DeepPartial<RatesUi>
) => ({
    payload: rates_ui
}));
