import { createStore, combineReducers, Unsubscribe } from 'redux';
import { Store } from 'redux';

import { Address, Amount, Nonce, Supply, Token } from '../redux/types';
import { NftFullId, NftIssue, NftLevel, NftToken } from '../redux/types';
import { BlockHash, State } from '../redux/types';

import { middleware } from '../redux/middleware';
import { Action } from '../redux/actions'

import { onNftAdded, OnNftAdded } from '../redux/observers';
import { onNftRemoved, OnNftRemoved } from '../redux/observers';
import { onNonceAdded, OnNonceAdded } from '../redux/observers';
import { onNonceRemoved, OnNonceRemoved } from '../redux/observers';
import { onTokenAdded, OnTokenAdded } from '../redux/observers';
import { onTokenRemoved, OnTokenRemoved } from '../redux/observers';

import { addNonce } from '../redux/actions';
import { removeNonce } from '../redux/actions';
import { removeNonces } from '../redux/actions';
import { removeNonceByAmount } from '../redux/actions';
import { nonceReducer } from '../redux/reducers';
import { nonceBy } from '../redux/selectors';

import { setNft } from '../redux/actions';
import { addNft } from '../redux/actions';
import { removeNft } from '../redux/actions';
import { nftReducer } from '../redux/reducers';
import { nftTotalBy } from '../redux/selectors';

import { setToken } from '../redux/actions';
import { addToken } from '../redux/actions';
import { removeToken } from '../redux/actions';
import { tokenReducer } from '../redux/reducers';

import { refresh } from '../redux/actions';
import { refreshed } from '../redux/selectors';
import { refreshReducer } from '../redux/reducers';

import { StateDb } from '../state-db';
import { Miner } from '../miner';

import { Tokenizer } from '../token';
import { Parser } from '../parser';
import { Global } from '../types';
declare const global: Global;

export class App {
    private static get me(): App {
        if (global.APP === undefined) {
            global.APP = new App();
        }
        return global.APP;
    }
    private constructor() {
        const reducer = combineReducers({
            refresh: refreshReducer,
            nonces: nonceReducer,
            nfts: nftReducer,
            tokens: tokenReducer
        });
        if (App.clear) {
            this.db.clear(App.persist);
        }
        if (App.clearAll) {
            this.db.clear();
        }
        this._store = createStore(
            reducer, this.db.load(App.persist), middleware({
                logger: App.logger
            })
        );
        if (App.persist > 0) this._store.subscribe(() => {
            const state = this._store.getState();
            if (!refreshed(state.refresh)) {
                this.db.save(App.persist, state);
            }
        });
    }
    public static addNonce(
        address: Address, block_hash: BlockHash, nonce: Nonce, amount: Amount
    ) {
        this.me.store.dispatch(addNonce(nonce, {
            address, block_hash, amount
        }));
    }
    public static removeNonce(
        address: Address, block_hash: BlockHash, nonce: Nonce
    ) {
        this.me.store.dispatch(removeNonce(nonce, {
            address, block_hash
        }));
    }
    public static removeNonceByAmount(
        address: Address, block_hash: BlockHash, amount: Amount
    ) {
        this.me.store.dispatch(removeNonceByAmount({
            address, block_hash, amount
        }));
    }
    public static removeNonces() {
        this.me.store.dispatch(removeNonces({
            address: null
        }));
    }
    public static onNonceAdded(
        address: Address, callback: OnNonceAdded
    ) {
        return onNonceAdded(this.me.store, (
            (nonce, item, total_by, total) => {
                if (item.address === address) {
                    callback(nonce, item, total_by, total);
                }
            }
        ));
    }
    public static onNonceRemoved(
        address: Address, callback: OnNonceRemoved
    ) {
        return onNonceRemoved(this.me.store, (
            (nonce, item, total_by, total) => {
                if (item.address === address) {
                    callback(nonce, item, total_by, total);
                }
            }
        ));
    }
    public static onNonceChanged(
        address: Address, callback: OnNonceAdded | OnNonceRemoved
    ): Unsubscribe {
        const un_add = this.onNonceAdded(address, callback);
        const un_rem = this.onNonceRemoved(address, callback);
        return () => { un_add(); un_rem(); };
    }
    public static getNonceBy(
        address: Address, block_hash: BlockHash, amount: Amount, index = 0
    ): Nonce | undefined {
        const { nonces } = this.me.store.getState();
        return nonceBy(
            nonces, { address, block_hash, amount }, index
        );
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
    public static onNftAdded(
        callback: OnNftAdded
    ) {
        return onNftAdded(this.me.store, callback);
    }
    public static onNftRemoved(
        callback: OnNftRemoved
    ) {
        return onNftRemoved(this.me.store, callback);
    }
    public static onNftChanged(
        callback: OnNftAdded | OnNftRemoved
    ): Unsubscribe {
        const un_add = this.onNftAdded(callback);
        const un_rem = this.onNftRemoved(callback);
        return () => { un_add(); un_rem(); };
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
    public static setToken(
        token: Token, item: {
            amount: Amount,
            supply: Supply
        }
    ) {
        this.me.store.dispatch(setToken(token, item));
    }
    public static addToken(
        token: Token, item: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(addToken(token, item));
    }
    public static removeToken(
        token: Token, item: {
            amount: Amount,
            supply?: Supply
        }
    ) {
        this.me.store.dispatch(removeToken(token, item));
    }
    public static onTokenAdded(
        callback: OnTokenAdded
    ) {
        return onTokenAdded(this.me.store, callback);
    }
    public static onTokenRemoved(
        callback: OnTokenRemoved
    ) {
        return onTokenRemoved(this.me.store, callback);
    }
    public static onTokenChanged(
        callback: OnTokenAdded | OnTokenRemoved
    ): Unsubscribe {
        const un_add = this.onTokenAdded(callback);
        const un_rem = this.onTokenRemoved(callback);
        return () => { un_add(); un_rem(); };
    }
    public static refresh() {
        this.me.store.dispatch(refresh());
    }
    public static miner(address: Address): Miner {
        return this.me.miner(address);
    }
    private miner(address: Address): Miner {
        if (this._miner === undefined) {
            const symbol = Tokenizer.symbol(App.params.get('token'));
            this._miner = new Miner(symbol, address, App.speed);
        }
        return this._miner;
    }
    private get db(): StateDb {
        if (this._db === undefined) {
            this._db = new StateDb(localStorage);
        }
        return this._db;
    }
    private static get clear(): boolean {
        return Parser.boolean(this.params.get('clear'), false);
    }
    private static get clearAll(): boolean {
        return Parser.boolean(this.params.get('clear-all'), false);
    }
    private static get persist(): number {
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
    public static get range(): { min: number, max: number } {
        const min = Parser.number(this.params.get('min-amount'), 1);
        const max = Parser.number(this.params.get('max-amount'), Infinity);
        return { min, max };
    }
    public static get params(): URLSearchParams {
        if (typeof document !== 'undefined') {
            return new URLSearchParams(document.location.search.substring(1));
        }
        return new URLSearchParams();
    }
    private static get logger(): boolean {
        return Parser.boolean(this.params.get('logger'), false);
    }
    private get store(): Store<State, Action> {
        return this._store;
    }
    private _db: StateDb | undefined;
    private _miner: Miner | undefined;
    private _store: Store<State, Action>;
}
export default App;
