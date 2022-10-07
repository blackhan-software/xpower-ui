import { AppState } from "../redux/store";

export class StateDb {
    constructor(storage: Storage) {
        this._storage = storage;
    }
    public clear(index?: number): void {
        if (typeof index === 'number') {
            this.storage.removeItem(this.key(index));
        } else {
            this.storage.clear();
        }
    }
    public load(index: number) {
        const item = this.storage.getItem(this.key(index));
        if (typeof item === 'string') {
            const state = JSON.parse(item);
            state.refresh = { date: null };
            delete state.nonces.more;
            delete state.nonces.less;
            delete state.nfts.more;
            delete state.nfts.less;
            delete state.ppts.more;
            delete state.ppts.less;
            return state;
        }
        return {
            nonces: { items: {} },
            nfts: { items: {} },
            ppts: { items: {} }
        };
    }
    public save(index: number, state: AppState): void {
        this.storage.setItem(this.key(index), JSON.stringify(state));
    }
    private key(index: number) {
        return `state[${index}]`;
    }
    private get storage() {
        return this._storage;
    }
    private _storage: Storage;
}
export default StateDb;
