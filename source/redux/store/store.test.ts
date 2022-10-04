/**
 * @jest-environment jsdom
 */
import { MemoryStorage } from '../../state-db/memory-storage';
import { Global } from '../../types';
declare const global: Global;

import { Store } from './store';

beforeEach(() => {
    global.document = {
        location: { search: '?persist=1' }
    };
    global.localStorage = new MemoryStorage();
});
afterEach(() => {
    delete global.APP_STORE;
});
describe('Store', () => {
    it('should have a singleton', () => {
        expect(Store['me']).toBeDefined();
    });
});
