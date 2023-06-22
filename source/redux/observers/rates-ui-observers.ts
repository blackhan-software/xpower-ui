import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { ratesUiState } from '../reducers';
import { AppState } from '../store';
import { RatesUi } from '../types';

export type OnRatesUi = (
    next: RatesUi, prev: RatesUi
) => void;
export type OnRatesUiRefresher = (
    next: RatesUi['refresher'], prev: RatesUi['refresher']
) => void;

export function onRatesUi(
    store: Store<AppState, AnyAction>,
    handler: OnRatesUi
): Unsubscribe {
    const selector = ({ rates_ui }: AppState) => rates_ui;
    const observer = observe<RatesUi>(store)(
        selector, ratesUiState()
    );
    return observer(handler);
}
export function onRatesUiRefresher(
    store: Store<AppState, AnyAction>,
    handler: OnRatesUiRefresher
): Unsubscribe {
    const selector = ({ rates_ui }: AppState) => rates_ui.refresher;
    const observer = observe<RatesUi['refresher']>(store)(
        selector, ratesUiState().refresher
    );
    return observer(handler);
}
export default onRatesUi;
