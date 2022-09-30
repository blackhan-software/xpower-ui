import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, DeepPartial, Store, Unsubscribe } from 'redux';
import { delayed } from '../functions';
import { Parser } from '../parser';
import { Action, addNft, addNonce, addPpt, increaseWallet, refresh, removeNft, removeNonce, removeNonceByAmount, removeNonces, removePpt, decreaseWallet, setMining, setMinting, setNft, setNftsUi, setPpt, setPptsUi, setWallet, switchPage, switchToken, setWalletUi } from '../redux/actions';
import { middleware } from '../redux/middleware';
import { onNftAdded, OnNftAdded, onNftRemoved, OnNftRemoved, onNonceAdded, OnNonceAdded, onNonceRemoved, OnNonceRemoved, onPageSwitch, OnPageSwitch, onPptAdded, OnPptAdded, onPptRemoved, OnPptRemoved, onWalletIncreased, OnWalletIncreased, onWalledDecreased, OnWalletDecreased, onTokenSwitch, OnTokenSwitch } from '../redux/observers';
import { miningReducer, mintingReducer, nftsReducer, nftsUiReducer, noncesReducer, pageReducer, pptsReducer, pptsUiReducer, refreshReducer, tokenReducer, walletReducer, walletUiReducer } from '../redux/reducers';
import { nftsBy, nftTotalBy, nonceBy, noncesBy, pptsBy, pptTotalBy, refreshed, walletFor } from '../redux/selectors';
import { Address, Amount, BlockHash, NftFullId, NftIssue, NftLevel, NftToken, Nonce, Page, Pager, State, Supply, Token } from '../redux/types';
import { StateDb } from '../state-db';
import { Tokenizer } from '../token';

import { Global, Version } from '../types';
declare const global: Global;
import mitt from 'mitt';

export class App {
    public static get event() {
        return this.me._event;
    }
    private static get me(): App {
        if (global.APP === undefined) {
            global.APP = new App();
        }
        return global.APP;
    }
    private constructor() {
        const reducer = combineReducers({
            page: pageReducer,
            token: tokenReducer,
            nonces: noncesReducer,
            mining: miningReducer,
            minting: mintingReducer,
            nfts: nftsReducer,
            nfts_ui: nftsUiReducer,
            ppts: pptsReducer,
            ppts_ui: pptsUiReducer,
            wallet: walletReducer,
            wallet_ui: walletUiReducer,
            refresh: refreshReducer,
        });
        if (App.clear) {
            this.db.clear(App.persist);
        }
        if (App.clearAll) {
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
                logger: App.logger
            }),
            preloadedState: this.db.load(App.persist),
        });
        if (App.persist > 0) this._store.subscribe(() => {
            const state = this._store.getState();
            if (!refreshed(state.refresh)) {
                this.db.save(App.persist, state);
            }
        });
    }
    public static switchPage(page: Page) {
        this.me.store.dispatch(switchPage(page));
    }
    public static onPageSwitch(
        callback: OnPageSwitch
    ) {
        return onPageSwitch(this.me.store, callback);
    }
    public static onPageSwitched(
        callback: OnPageSwitch, ms = 600
    ) {
        return onPageSwitch(this.me.store, delayed(callback, ms));
    }
    public static switchToken(token: Token) {
        this.me.store.dispatch(switchToken(token));
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
    public static getMining(): State['mining'] {
        const { mining } = this.me.store.getState();
        return mining;
    }
    public static setMining(
        mining: Partial<State['mining']>
    ) {
        this.me.store.dispatch(setMining(mining));
    }
    public static getMinting(): State['minting'] {
        const { minting } = this.me.store.getState();
        return minting;
    }
    public static setMinting(
        minting: Partial<State['minting']>
    ) {
        this.me.store.dispatch(setMinting(minting));
    }
    public static getNftsUi(): State['nfts_ui'] {
        const { nfts_ui } = this.me.store.getState();
        return nfts_ui;
    }
    public static setNftsUi(
        nfts_ui: DeepPartial<State['nfts_ui']>
    ) {
        this.me.store.dispatch(setNftsUi(nfts_ui));
    }
    public static getPptsUi(): State['ppts_ui'] {
        const { ppts_ui } = this.me.store.getState();
        return ppts_ui;
    }
    public static setPptsUi(
        ppts_ui: DeepPartial<State['ppts_ui']>
    ) {
        this.me.store.dispatch(setPptsUi(ppts_ui));
    }
    public static addNonce(
        nonce: Nonce, item: {
            address: Address,
            amount: Amount,
            block_hash: BlockHash,
            token: Token,
            worker: number,
        }
    ) {
        this.me.store.dispatch(addNonce(nonce, item));
    }
    public static removeNonce(
        nonce: Nonce, item: {
            address: Address,
            block_hash: BlockHash,
            token: Token
        }
    ) {
        this.me.store.dispatch(removeNonce(nonce, item));
    }
    public static removeNonceByAmount(
        item: {
            address: Address,
            amount: Amount,
            block_hash: BlockHash,
            token: Token
        }
    ) {
        this.me.store.dispatch(removeNonceByAmount(item));
    }
    public static removeNonces() {
        this.me.store.dispatch(removeNonces({
            address: null, token: null
        }));
    }
    public static onNonceAdded(
        callback: OnNonceAdded
    ) {
        return onNonceAdded(this.me.store, (
            (nonce, item, total_by, total) => {
                callback(nonce, item, total_by, total);
            }
        ));
    }
    public static onNonceRemoved(
        callback: OnNonceRemoved
    ) {
        return onNonceRemoved(this.me.store, (
            (nonce, item, total_by, total) => {
                callback(nonce, item, total_by, total);
            }
        ));
    }
    public static onNonceChanged(
        callback: OnNonceAdded | OnNonceRemoved
    ): Unsubscribe {
        const un_add = this.onNonceAdded(callback);
        const un_rem = this.onNonceRemoved(callback);
        return () => { un_add(); un_rem(); };
    }
    public static getNonceBy(query?: {
        address?: Address,
        amount?: Amount,
        block_hash?: BlockHash,
        token?: Token
    }, index = 0): Partial<{
        nonce: Nonce, item: {
            address: Address,
            amount: Amount,
            block_hash: BlockHash
            token: Token,
        }
    }> {
        const { nonces } = this.me.store.getState();
        return nonceBy(nonces, query, index);
    }
    public static getNoncesBy(query?: {
        address?: Address,
        amount?: Amount,
        block_hash?: BlockHash,
        token?: Token
    }): Array<{
        nonce: Nonce, item: {
            address: Address,
            amount: Amount,
            block_hash: BlockHash
            token: Token,
        }
    }> {
        const { nonces } = this.me.store.getState();
        return noncesBy(nonces, query);
    }
    public static setNft(
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item: {
            amount: Amount,
            supply: Supply
        }
    ) {
        this.me.store.dispatch(setNft(nft, item));
    }
    public static setPpt(
        ppt: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item: {
            amount: Amount,
            supply: Supply
        }
    ) {
        this.me.store.dispatch(setPpt(ppt, item));
    }
    public static addNft(
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(addNft(nft, item));
    }
    public static addPpt(
        ppt: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(addPpt(ppt, item));
    }
    public static removeNft(
        nft: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(removeNft(nft, item));
    }
    public static removePpt(
        ppt: NftFullId | {
            token: NftToken,
            issue: NftIssue,
            level: NftLevel,
        },
        item?: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(removePpt(ppt, item));
    }
    public static onNftAdded(
        callback: OnNftAdded
    ) {
        return onNftAdded(this.me.store, callback);
    }
    public static onPptAdded(
        callback: OnPptAdded
    ) {
        return onPptAdded(this.me.store, callback);
    }
    public static onNftRemoved(
        callback: OnNftRemoved
    ) {
        return onNftRemoved(this.me.store, callback);
    }
    public static onPptRemoved(
        callback: OnPptRemoved
    ) {
        return onPptRemoved(this.me.store, callback);
    }
    public static onNftChanged(
        callback: OnNftAdded | OnNftRemoved
    ): Unsubscribe {
        const un_add = this.onNftAdded(callback);
        const un_rem = this.onNftRemoved(callback);
        return () => { un_add(); un_rem(); };
    }
    public static onPptChanged(
        callback: OnNftAdded | OnNftRemoved
    ): Unsubscribe {
        const un_add = this.onPptAdded(callback);
        const un_rem = this.onPptRemoved(callback);
        return () => { un_add(); un_rem(); };
    }
    public static getNftsBy(nft: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
        token?: NftToken,
    }) {
        const { nfts } = this.me.store.getState();
        return nftsBy(nfts, nft)
    }
    public static getNftTotalBy(nft: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
        token?: NftToken,
    }): {
        amount: Amount, supply: Supply
    } {
        const { nfts } = this.me.store.getState();
        return nftTotalBy(nfts, nft);
    }
    public static getPptsBy(ppt: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
        token?: NftToken,
    }) {
        const { ppts } = this.me.store.getState();
        return pptsBy(ppts, ppt)
    }
    public static getPptTotalBy(ppt: NftFullId | {
        issue?: NftIssue,
        level?: NftLevel,
        token?: NftToken,
    }): {
        amount: Amount, supply: Supply
    } {
        const { ppts } = this.me.store.getState();
        return pptTotalBy(ppts, ppt);
    }
    public static getWallet(token?: Token) {
        const { wallet } = this.me.store.getState();
        return walletFor(wallet, token)
    }
    public static setWallet(
        token: Token, item: { amount: Amount, supply: Supply }
    ) {
        this.me.store.dispatch(setWallet(token, item));
    }
    public static increaseWallet(
        token: Token, item: { amount: Amount, supply?: Supply }
    ) {
        this.me.store.dispatch(increaseWallet(token, item));
    }
    public static decreaseWallet(
        token: Token, item: { amount: Amount, supply?: Supply }
    ) {
        this.me.store.dispatch(decreaseWallet(token, item));
    }
    public static onWalletIncreased(
        callback: OnWalletIncreased
    ) {
        return onWalletIncreased(this.me.store, callback);
    }
    public static onWalletDecreased(
        callback: OnWalletDecreased
    ) {
        return onWalledDecreased(this.me.store, callback);
    }
    public static onWalletChanged(
        callback: OnWalletIncreased | OnWalletDecreased
    ): Unsubscribe {
        const un_add = this.onWalletIncreased(callback);
        const un_rem = this.onWalletDecreased(callback);
        return () => { un_add(); un_rem(); };
    }
    public static getWalletUi(): State['wallet_ui'] {
        const { wallet_ui } = this.me.store.getState();
        return wallet_ui;
    }
    public static setWalletUi(
        wallet_ui: DeepPartial<State['wallet_ui']>
    ) {
        this.me.store.dispatch(setWalletUi(wallet_ui));
    }
    public static refresh() {
        this.me.store.dispatch(refresh());
    }
    private get db(): StateDb {
        if (this._db === undefined) {
            this._db = new StateDb(localStorage);
        }
        return this._db;
    }
    public static get clear(): boolean {
        return Parser.boolean(this.params.get('clear'), false);
    }
    public static get clearAll(): boolean {
        return Parser.boolean(this.params.get('clear-all'), false);
    }
    public static get debug(): boolean {
        return Parser.boolean(this.params.get('debug'), false);
    }
    public static get level(): { min: number, max: number } {
        const min = Parser.number(
            this.params.get('min-level'), 5
        );
        const max = Parser.number(
            this.params.get('max-level'), 64
        );
        return { min, max };
    }
    public static get nftLevel(): { min: number, max: number } {
        const min = Parser.number(
            this.params.get('min-nft-level'), NftLevel.UNIT
        );
        const max = Parser.number(
            this.params.get('max-nft-level'), NftLevel.PETA
        );
        return { min, max };
    }
    public static get logger(): boolean {
        return Parser.boolean(this.params.get('logger'), false);
    }
    public static get auto_mint(): number {
        return Parser.number(this.params.get('auto-mint'), 3000);
    }
    public static get persist(): number {
        const element = document.getElementById('g-persistence');
        const fallback = Parser.number(element?.dataset.value, 0);
        return Parser.number(this.params.get('persist'), fallback);
    }
    public static get speed(): number {
        const element = document.getElementById('g-mining-speed');
        const fallback = Parser.number(element?.dataset.value, 50);
        const value = Parser.number(this.params.get('speed'), fallback);
        return Math.min(100, Math.max(0, value)) / 100;
    }
    public static get token(): Token {
        return Tokenizer.token(this.params.get('token'));
    }
    public static get page(): Page {
        if (typeof location !== 'undefined') {
            return Pager.parse(location.pathname);
        }
        return Page.None;
    }
    public static get version(): Version {
        switch (this.params.get('version')) {
            case 'v2a':
                return 'v2a';
            case 'v3a':
                return 'v3a';
            case 'v3b':
                return 'v3b';
            case 'v4a':
                return 'v4a';
            default:
                return 'v4a';
        }
    }
    public static get params(): URLSearchParams {
        if (typeof location !== 'undefined') {
            return new URLSearchParams(location.search.substring(1));
        }
        return new URLSearchParams();
    }
    public static get store() {
        return this.me.store;
    }
    private get store(): Store<State, Action> {
        return this._store;
    }
    private _event = mitt<{
        'refresh-tips': undefined | {
            keep?: boolean;
        };
        'toggle-level': {
            level?: NftLevel; flag: boolean;
        };
        'toggle-issue': {
            level?: NftLevel; issue?: NftIssue; flag: boolean;
        };
    }>();
    private _db: StateDb | undefined;
    private _store: Store<State, Action>;
}
export default App;
