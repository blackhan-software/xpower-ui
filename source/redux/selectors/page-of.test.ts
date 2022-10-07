import { Page } from '../types';
import { pageOf } from './page-of';

describe('page-of', () => {
    it('should return page', () => {
        const page = Page.None;
        const page_of = pageOf({ page });
        expect(page_of).toEqual(page);
    });
});
