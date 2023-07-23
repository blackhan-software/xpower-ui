/**
 * @jest-environment jsdom
 */
import { Store } from '.';

describe('Store', () => {
    it('should have a store', () => {
        expect(Store()).toBeDefined();
    });
});
