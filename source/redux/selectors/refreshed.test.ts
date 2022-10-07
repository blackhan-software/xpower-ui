import { refreshed } from './refreshed';

describe('refreshed', () => {
    const state = { refresh: { date: null } };
    it('should return true', () => {
        expect(refreshed(state)).toEqual(true);
    });
    it('should return false', () => {
        expect(refreshed(state)).toEqual(false);
    });
    it('should return false (again)', () => {
        expect(refreshed(state)).toEqual(false);
    });
    it('should return true', () => {
        const state = { refresh: { date: new Date().toISOString() } };
        expect(refreshed(state)).toEqual(true);
    });
});

describe('refreshed', () => {
    const state = { refresh: { date: new Date().toISOString() } };
    it('should return true', () => {
        expect(refreshed(state)).toEqual(true);
    });
    it('should return false', () => {
        expect(refreshed(state)).toEqual(false);
    });
    it('should return false (again)', () => {
        expect(refreshed(state)).toEqual(false);
    });
    it('should return true', () => {
        const state = { refresh: { date: new Date().toISOString() } };
        expect(refreshed(state)).toEqual(true);
    });
});
