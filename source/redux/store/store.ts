import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { combineReducers, Store as ReduxStore, Unsubscribe } from 'redux';

import { delayed } from '../../functions';
import { Params } from '../../params';
import { StateDb } from '../../state-db';
import { middleware } from '../middleware';

import { onAftWalletDecreased, OnAftWalletDecreased, onAftWalletIncreased, OnAftWalletIncreased, onNftAdded, OnNftAdded, onNftRemoved, OnNftRemoved, onNonceAdded, OnNonceAdded, onNonceRemoved, OnNonceRemoved, onPageSwitch, OnPageSwitch, onPptAdded, onPptRemoved, onTokenSwitch, OnTokenSwitch } from '../observers';
import { aftWalletReducer, miningReducer, mintingReducer, nftsReducer, nftsUiReducer, noncesReducer, otfWalletReducer, pageReducer, pptsReducer, pptsUiReducer, refreshReducer, tokenReducer } from '../reducers';
import { nftsBy, nftTotalBy, nonceBy, noncesBy, pptsBy, pptTotalBy, refreshed, walletFor } from '../selectors';
import { Address, Amount, BlockHash, Level, NftFullId, NftIssue, NftLevel, NftToken, State, Token } from '../types';

import { Global } from '../../types';
declare const global: Global;

export class Store {
    public static get dispatch() {
        return this.me.store.dispatch;
    }
    public static get store() {
        return this.me.store;
    }
    private static get me(): Store {
        if (global.APP_STORE === undefined) {
            global.APP_STORE = new Store({
                clear: Params.clear, clearAll: Params.clearAll,
                logger: Params.logger, persist: Params.persist
            });
        }
        return global.APP_STORE;
    }
    /* ========================================================================
     * Selectors:
     * ===================================================================== */
    public static getPage() {
        const { page } = this.me.store.getState();
        return page;
    }
    public static getToken() {
        const { token } = this.me.store.getState();
        return token;
    }
    public static getAftWallet(token?: Token) {
        const { aft_wallet } = this.me.store.getState();
        return walletFor(aft_wallet, token);
    }
    public static getOtfWallet() {
        const { otf_wallet } = this.me.store.getState();
        return otf_wallet;
    }
    public static getMintingRow(
        { level }: { level: Level; }
    ) {
        const { minting } = this.me.store.getState();
        return minting.rows[level - 1];
    }
    public static getNonceBy(query?: {
        address?: Address;
        amount?: Amount;
        block_hash?: BlockHash;
        token?: Token;
    }, index = 0) {
        const { nonces } = this.me.store.getState();
        return nonceBy(nonces, query, index);
    }
    public static getNoncesBy(query?: {
        address?: Address;
        amount?: Amount;
        block_hash?: BlockHash;
        token?: Token;
    }) {
        const { nonces } = this.me.store.getState();
        return noncesBy(nonces, query);
    }
    public static getNftsUi() {
        const { nfts_ui } = this.me.store.getState();
        return nfts_ui;
    }
    public static getNftsBy(nft: NftFullId | {
        issue?: NftIssue;
        level?: NftLevel;
        token?: NftToken;
    }) {
        const { nfts } = this.me.store.getState();
        return nftsBy(nfts, nft);
    }
    public static getNftTotalBy(nft: NftFullId | {
        issue?: NftIssue;
        level?: NftLevel;
        token?: NftToken;
    }) {
        const { nfts } = this.me.store.getState();
        return nftTotalBy(nfts, nft);
    }
    public static getPptsUi() {
        const { ppts_ui } = this.me.store.getState();
        return ppts_ui;
    }
    public static getPptsBy(ppt: NftFullId | {
        issue?: NftIssue;
        level?: NftLevel;
        token?: NftToken;
    }) {
        const { ppts } = this.me.store.getState();
        return pptsBy(ppts, ppt);
    }
    public static getPptTotalBy(ppt: NftFullId | {
        issue?: NftIssue;
        level?: NftLevel;
        token?: NftToken;
    }) {
        const { ppts } = this.me.store.getState();
        return pptTotalBy(ppts, ppt);
    }
    /* ========================================================================
     * Observers:
     * ===================================================================== */
    public static onPageSwitch(
        callback: OnPageSwitch, ms = 0
    ) {
        return onPageSwitch(this.me.store, delayed(callback, ms));
    }
    public static onPageSwitched(
        callback: OnPageSwitch, ms = 600
    ) {
        return onPageSwitch(this.me.store, delayed(callback, ms));
    }
    public static onTokenSwitch(
        callback: OnTokenSwitch, ms = 0
    ) {
        return onTokenSwitch(this.me.store, delayed(callback, ms));
    }
    public static onTokenSwitched(
        callback: OnTokenSwitch, ms = 900
    ) {
        return onTokenSwitch(this.me.store, delayed(callback, ms));
    }
    public static onAftWalletChanged(
        callback: OnAftWalletIncreased | OnAftWalletDecreased
    ): Unsubscribe {
        const un_add = onAftWalletIncreased(this.me.store, callback);
        const un_rem = onAftWalletDecreased(this.me.store, callback);
        return () => { un_add(); un_rem(); };
    }
    public static onNonceChanged(
        callback: OnNonceAdded | OnNonceRemoved
    ): Unsubscribe {
        const un_add = onNonceAdded(this.me.store, callback);
        const un_rem = onNonceRemoved(this.me.store, callback);
        return () => { un_add(); un_rem(); };
    }
    public static onNftChanged(
        callback: OnNftAdded | OnNftRemoved
    ): Unsubscribe {
        const un_add = onNftAdded(this.me.store, callback);
        const un_rem = onNftRemoved(this.me.store, callback);
        return () => { un_add(); un_rem(); };
    }
    public static onPptChanged(
        callback: OnNftAdded | OnNftRemoved
    ): Unsubscribe {
        const un_add = onPptAdded(this.me.store, callback);
        const un_rem = onPptRemoved(this.me.store, callback);
        return () => { un_add(); un_rem(); };
    }
    /* ========================================================================
     * Instance:
     * ===================================================================== */
    private constructor(options: {
        clear: boolean, clearAll: boolean,
        logger: boolean, persist: number
    }) {
        const reducer = combineReducers({
            aft_wallet: aftWalletReducer,
            mining: miningReducer,
            minting: mintingReducer,
            nfts: nftsReducer,
            nfts_ui: nftsUiReducer,
            nonces: noncesReducer,
            otf_wallet: otfWalletReducer,
            page: pageReducer,
            ppts: pptsReducer,
            ppts_ui: pptsUiReducer,
            refresh: refreshReducer,
            token: tokenReducer,
        });
        if (options.clear) {
            this.db.clear(options.persist);
        }
        if (options.clearAll) {
            this.db.clear();
        }
        this._store = configureStore({
            reducer, middleware: (m) => m({
                /**
                 * @todo: fix bigint check & re-enable!
                 */
                serializableCheck: false
            }),
            enhancers: middleware<typeof reducer, State>({
                logger: options.logger
            }),
            preloadedState: this.db.load(options.persist),
        });
        if (options.persist > 0)
            this._store.subscribe(() => {
                const state = this._store.getState();
                if (!refreshed(state.refresh)) {
                    this.db.save(options.persist, state);
                }
            });
    }
    private get db(): StateDb {
        if (this._db === undefined) {
            this._db = new StateDb(localStorage);
        }
        return this._db;
    }
    private get store(): ReduxStore<State, AnyAction> {
        return this._store;
    }
    private _db: StateDb | undefined;
    private _store: ReduxStore<State, AnyAction>;
}
export default Store;
