/* eslint @typescript-eslint/no-explicit-any: [off] */
import { pptsReducer } from './ppts-reducer';

import { setPpt } from '../actions';
import { addPpt } from '../actions';
import { removePpt } from '../actions';
import { Nfts, Empty } from '../types';

describe('Store w/ppts-reducer (set)', () => {
    const id = '2202103';
    it('should set 1 ppt', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, setPpt(id, {
            amount: 1n, supply: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should set 2 ppts', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, setPpt(id, {
            amount: 2n, supply: 5n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 2n, supply: 5n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
    });
});
describe('Store w/ppts-reducer (add)', () => {
    const id = '2202103';
    it('should add 1 ppt (w/rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should add 1 ppt (w/abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 10n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
    });
    it('should *not* add 1 ppt (w/abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        let state_1;
        try {
            state_1 = pptsReducer(state_0, addPpt(id, {
                amount: 2n, supply: 1n
            }));
        } catch (ex: any) {
            expect(ex.message).toBe(`PPT(${id}) supply=1 < amount=2`)
        }
        expect(state_1).not.toBeDefined();
    });
    it('should add 2 ppts (w/1st:rel. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = pptsReducer(state_1, addPpt(id, {
            amount: 2n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 3n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([id]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should add 2 ppts (w/1st:abs. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 10n
        });
        const state_2 = pptsReducer(state_1, addPpt(id, {
            amount: 2n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 12n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([id]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should add 2 ppts (w/1st:rel. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = pptsReducer(state_1, addPpt(id, {
            amount: 2n, supply: 20n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 20n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([id]);
        expect(state_2.less).not.toBeDefined();
    });
    it('should add 2 ppts (w/1st:abs. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 1n, supply: 10n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 10n
        });
        const state_2 = pptsReducer(state_1, addPpt(id, {
            amount: 2n, supply: 20n
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 20n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).toEqual([id]);
        expect(state_2.less).not.toBeDefined();
    });
});
describe('Store w/ppts-reducer (remove)', () => {
    const id = '2202109';
    it('should remove 1 ppt (w/rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = pptsReducer(state_1, removePpt(id, {
            amount: 1n, kind: 'burn'
        }));
        expect(state_2.items[id]).toEqual({
            amount: 0n, supply: 0n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
    });
    it('should remove 1 ppt (w/abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 1n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 1n, supply: 1n
        });
        const state_2 = pptsReducer(state_1, removePpt(id, {
            amount: 1n, supply: 10n, kind: 'burn'
        }));
        expect(state_2.items[id]).toEqual({
            amount: 0n, supply: 10n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
    });
    it('should *not* remove 1 ppt (w/abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 5n
        }));
        let state_2;
        try {
            state_2 = pptsReducer(state_1, removePpt(id, {
                amount: 2n, supply: 1n, kind: 'burn'
            }));
        } catch (ex: any) {
            expect(ex.message).toBe(`PPT(${id}) supply=1 < amount=3`)
        }
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2).not.toBeDefined();
    });
    it('should remove 2 ppts (w/1st:rel. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 5n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = pptsReducer(state_1, removePpt(id, {
            amount: 2n, kind: 'burn'
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 3n
        });
        const state_3 = pptsReducer(state_2, removePpt(id, {
            amount: 1n, kind: 'burn'
        }));
        expect(state_3.items[id]).toEqual({
            amount: 2n, supply: 2n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([id]);
    });
    it('should remove 2 ppts (w/1st:abs. supply & 2nd:rel. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 5n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = pptsReducer(state_1, removePpt(id, {
            amount: 2n, supply: 4n, kind: 'burn'
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 4n
        });
        const state_3 = pptsReducer(state_2, removePpt(id, {
            amount: 1n, kind: 'burn'
        }));
        expect(state_3.items[id]).toEqual({
            amount: 2n, supply: 3n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([id]);
    });
    it('should remove 2 ppts (w/1st:rel. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 5n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = pptsReducer(state_1, removePpt(id, {
            amount: 2n, kind: 'burn'
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 3n
        });
        const state_3 = pptsReducer(state_2, removePpt(id, {
            amount: 1n, supply: 3n, kind: 'burn'
        }));
        expect(state_3.items[id]).toEqual({
            amount: 2n, supply: 3n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([id]);
    });
    it('should remove 2 ppts (w/1st:abs. supply & 2nd:abs. supply)', () => {
        const state_0 = Empty<Nfts>();
        const state_1 = pptsReducer(state_0, addPpt(id, {
            amount: 5n
        }));
        expect(state_1.items[id]).toEqual({
            amount: 5n, supply: 5n
        });
        const state_2 = pptsReducer(state_1, removePpt(id, {
            amount: 2n, supply: 4n, kind: 'burn'
        }));
        expect(state_2.items[id]).toEqual({
            amount: 3n, supply: 4n
        });
        const state_3 = pptsReducer(state_2, removePpt(id, {
            amount: 1n, supply: 3n, kind: 'burn'
        }));
        expect(state_3.items[id]).toEqual({
            amount: 2n, supply: 3n
        });
        expect(state_1.more).toEqual([id]);
        expect(state_1.less).not.toBeDefined();
        expect(state_2.more).not.toBeDefined();
        expect(state_2.less).toEqual([id]);
        expect(state_3.more).not.toBeDefined();
        expect(state_3.less).toEqual([id]);
    });
});
