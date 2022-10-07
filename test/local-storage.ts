import { Global } from '../source/types';
declare const global: Global;
/**
 * mock local-storage:
 */
export class MemoryStorage implements Storage {
    get length(): number {
        return Object.keys(this._storage).length;
    }
    clear(): void {
        this._storage = {};
    }
    getItem(key: string): string | null {
        return this._storage[key] ?? null;
    }
    key(index: number): string | null {
        return Object.keys(this._storage)[index] || null;
    }
    removeItem(key: string): void {
        delete this._storage[key];
    }
    setItem(key: string, value: string): void {
        this._storage[key] = value || '';
    }
    private _storage: Record<string, string> = {};
}
global.localStorage = new MemoryStorage();
