/**
 * @jest-environment jsdom
 */
import { Global } from '../../types';
declare const global: Global;
import { Store } from '.';

beforeEach(() => {
    global.location = { search: '?persist=1' };
});
describe('Store', () => {
    it('should have a store', () => {
        expect(Store()).toBeDefined();
    });
});
