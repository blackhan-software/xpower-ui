import { setPptsUi } from '../actions';
import { pptAmounts, pptDetails, pptFlags, pptMinter, pptsUiReducer, pptWrap } from './ppts-ui-reducer';

describe('Store w/ppts-ui-reducer', () => {
    it('should set ppts-ui [toggled==true]', () => {
        const state_0 = {
            amounts: pptWrap(pptAmounts()),
            details: pptWrap(pptDetails()),
            minter: pptWrap(pptMinter()),
            flags: pptFlags(),
            toggled: false,
            expanded: null
        };
        const state_1 = pptsUiReducer(state_0, setPptsUi({
            toggled: true
        }));
        expect(state_1.toggled).toEqual(true);
    });
    it('should set ppts-ui [toggled==false]', () => {
        const state_0 = {
            amounts: pptWrap(pptAmounts()),
            details: pptWrap(pptDetails()),
            minter: pptWrap(pptMinter()),
            flags: pptFlags(),
            toggled: true,
            expanded: null
        };
        const state_1 = pptsUiReducer(state_0, setPptsUi({
            toggled: false
        }));
        expect(state_1.toggled).toEqual(false);
    });
});
