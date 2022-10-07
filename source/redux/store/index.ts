import { ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { Unsubscribe } from 'redux';
import { delayed } from '../../functions';
import * as observers from '../observers';
import { store } from './store';

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType, AppState, unknown, AnyAction
>;
export class Store {
    public static get dispatch() {
        return store.dispatch;
    }
    public static get store() {
        return store;
    }
    public static get state() {
        return store.getState();
    }
    /* ========================================================================
     * Observers:
     * ===================================================================== */
    public static onPageSwitch(
        callback: observers.OnPageSwitch, ms = 0
    ) {
        return observers.onPageSwitch(store, delayed(callback, ms));
    }
    public static onPageSwitched(
        callback: observers.OnPageSwitch, ms = 600
    ) {
        return observers.onPageSwitch(store, delayed(callback, ms));
    }
    public static onTokenSwitch(
        callback: observers.OnTokenSwitch, ms = 0
    ) {
        return observers.onTokenSwitch(store, delayed(callback, ms));
    }
    public static onTokenSwitched(
        callback: observers.OnTokenSwitch, ms = 600
    ) {
        return observers.onTokenSwitch(store, delayed(callback, ms));
    }
    public static onAftWalletChanged(callback:
        observers.OnAftWalletIncreased |
        observers.OnAftWalletDecreased
    ): Unsubscribe {
        const un_add = observers.onAftWalletIncreased(store, callback);
        const un_rem = observers.onAftWalletDecreased(store, callback);
        return () => { un_add(); un_rem(); };
    }
    public static onNonceChanged(
        callback: observers.OnNonceAdded | observers.OnNonceRemoved
    ): Unsubscribe {
        const un_add = observers.onNonceAdded(store, callback);
        const un_rem = observers.onNonceRemoved(store, callback);
        return () => { un_add(); un_rem(); };
    }
    public static onNftChanged(
        callback: observers.OnNftAdded | observers.OnNftRemoved
    ): Unsubscribe {
        const un_add = observers.onNftAdded(store, callback);
        const un_rem = observers.onNftRemoved(store, callback);
        return () => { un_add(); un_rem(); };
    }
    public static onPptChanged(
        callback: observers.OnNftAdded | observers.OnNftRemoved
    ): Unsubscribe {
        const un_add = observers.onPptAdded(store, callback);
        const un_rem = observers.onPptRemoved(store, callback);
        return () => { un_add(); un_rem(); };
    }
}
export default Store;
