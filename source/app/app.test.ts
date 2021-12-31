/**
 * @jest-environment jsdom
 */
import { MemoryStorage } from '../state-db/memory-storage';
import { Global } from '../types';
declare const global: Global;

import { App } from '.';

beforeEach(() => {
    global.document = {
        location: { search: '?persist=1' }
    };
    global.localStorage = new MemoryStorage();
});
afterEach(() => {
    delete global.APP;
});
describe('Application', () => {
    it('should have a singleton', () => {
        expect(App['me']).toBeDefined();
    });
});
