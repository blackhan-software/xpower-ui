import { refreshed } from './refreshed';

describe('refreshed', () => {
    const date = null;
    it('should return true', () => {
        expect(refreshed({ date })).toEqual(true);
    });
    it('should return false', () => {
        expect(refreshed({ date })).toEqual(false);
    });
    it('should return false (again)', () => {
        expect(refreshed({ date })).toEqual(false);
    });
    it('should return true', () => {
        expect(refreshed({ date: new Date().toISOString() })).toEqual(true);
    });
});

describe('refreshed', () => {
    const date = new Date().toISOString();
    it('should return true', () => {
        expect(refreshed({ date })).toEqual(true);
    });
    it('should return false', () => {
        expect(refreshed({ date })).toEqual(false);
    });
    it('should return false (again)', () => {
        expect(refreshed({ date })).toEqual(false);
    });
    it('should return true', () => {
        expect(refreshed({ date: new Date().toISOString() })).toEqual(true);
    });
});
