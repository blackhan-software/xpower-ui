/* eslint @typescript-eslint/no-explicit-any: [off] */
export class MemoryStorage implements Storage {
    [name: string]: any;
    clear(): void {
        this._storage = {};
    }
    setItem(key: string, value: string): void {
        this._storage[key] = value || '';
    }
    getItem(key: string): string | null {
        return key in this._storage ? this._storage[key] : null;
    }
    removeItem(key: string): void {
        delete this._storage[key];
    }
    key(index: number): string | null {
        const keys = Object.keys(this._storage);
        return keys[index] || null;
    }
    get length(): number {
        return Object.keys(this._storage).length;
    }
    private _storage: { [key: string]: string } = {};
}
export default MemoryStorage;
