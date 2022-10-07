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
        expect(Store.store).toBeDefined();
    });
    it('should have a state', () => {
        expect(Store.state).toBeDefined();
    });
    it('should have a dispatcher', () => {
        expect(Store.dispatch).toBeDefined();
    });
});
