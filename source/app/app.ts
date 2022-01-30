import { createStore, combineReducers } from 'redux';
import { Store } from 'redux';

import { Address, Amount, Nonce, State } from '../redux/types';
import { middleware } from '../redux/middleware';
import { Action } from '../redux/actions'

import { refresh } from '../redux/actions';
import { refreshed } from '../redux/selectors';
import { refreshReducer } from '../redux/reducers';

import { addNonce } from '../redux/actions';
import { removeNonce } from '../redux/actions';
import { removeNonces } from '../redux/actions';
import { removeNonceByAmount } from '../redux/actions';
import { nonceBy } from '../redux/selectors';
import { nonceReducer } from '../redux/reducers';
import { onNonceAdded, OnNonceAdded } from '../redux/observers';
import { onNonceRemoved, OnNonceRemoved } from '../redux/observers';

import { Blockchain } from '../blockchain';
import { StateDb } from '../state-db';
import { Miner } from '../miner';

import { Parser } from '../parser';
import { Global } from '../types';
declare const global: Global;

export class App {
    public static get me(): App {
        if (global.APP === undefined) {
            global.APP = new App();
        }
        return global.APP;
    }
    private constructor() {
        const reducer = combineReducers({
            refresh: refreshReducer,
            nonces: nonceReducer
        });
        if (this.clear) {
            this.db.clear(this.persist);
        }
        if (this.clearAll) {
            this.db.clear();
        }
        this._store = createStore(
            reducer, this.db.load(this.persist), middleware({
                logger: this.logger
            })
        );
        if (this.persist > 0) this._store.subscribe(() => {
            const state = this._store.getState();
            if (!refreshed(state.refresh)) {
                this.db.save(this.persist, state);
            }
        });
    }
    public addNonce(nonce: Nonce, amount: Amount): void {
        this.store.dispatch(addNonce(nonce, {
            address: this.address, amount
        }));
    }
    public removeNonce(nonce: Nonce): void {
        this.store.dispatch(removeNonce(nonce, {
            address: this.address
        }));
    }
    public removeNonceByAmount(amount: Amount): void {
        this.store.dispatch(removeNonceByAmount({
            address: this.address, amount
        }));
    }
    public removeNonces(): void {
        const { nonces } = this.store.getState();
        Object.keys(nonces).forEach(nonce => {
            this.removeNonce(nonce);
        });
    }
    public onNonceAdded(callback: OnNonceAdded): void {
        onNonceAdded(this.store, ((nonce, item, total_by, total) => {
            if (item.address === this.address) {
                callback(nonce, item, total_by, total);
            }
        }));
    }
    public onNonceRemoved(callback: OnNonceRemoved): void {
        onNonceRemoved(this.store, ((nonce, item, total_by, total) => {
            if (item.address === this.address) {
                callback(nonce, item, total_by, total);
            }
        }));
    }
    public getNonceBy(amount: Amount, index = 0): Nonce | undefined {
        const { nonces } = this.store.getState();
        return nonceBy(
            nonces, { address: this.address, amount }, index
        );
    }
    public refresh(): void {
        this.store.dispatch(refresh());
    }
    public remove(): void {
        this.store.dispatch(removeNonces({
            address: null
        }));
    }
    public get address(): Address {
        return Blockchain.me.selectedAddress;
    }
    public get miner(): Miner {
        if (this._miner === undefined) {
            this._miner = new Miner(this.address, this.speed);
        }
        return this._miner;
    }
    private get db(): StateDb {
        if (this._db === undefined) {
            this._db = new StateDb(localStorage);
        }
        return this._db;
    }
    private get clear(): boolean {
        return Parser.boolean(this.params.get('clear'), false);
    }
    private get clearAll(): boolean {
        return Parser.boolean(this.params.get('clear-all'), false);
    }
    private get persist(): number {
        const element = document.getElementById('g-persistence');
        const fallback = Parser.number(element?.dataset.value, 0);
        return Parser.number(this.params.get('persist'), fallback);
    }
    public get speed(): number {
        const element = document.getElementById('g-mining-speed');
        const fallback = Parser.number(element?.dataset.value, 50);
        const value = Parser.number(this.params.get('speed'), fallback);
        return Math.min(100, Math.max(0, value)) / 100;
    }
    private get logger(): boolean {
        return Parser.boolean(this.params.get('logger'), false);
    }
    public get range(): { min: number, max: number } {
        const min = Parser.number(this.params.get('min-amount'), 1);
        const max = Parser.number(this.params.get('max-amount'), Infinity);
        return { min, max };
    }
    private get params() {
        if (typeof document !== 'undefined') {
            return new URLSearchParams(document.location.search.substring(1));
        }
        return new URLSearchParams();
    }
    private get store(): Store<State, Action> {
        return this._store;
    }
    private _db: StateDb | undefined;
    private _miner: Miner | undefined;
    private _store: Store<State, Action>;
}
export default App;
