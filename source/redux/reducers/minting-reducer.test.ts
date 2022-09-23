import { mintingReducer } from './minting-reducer';
import { setMinting } from '../actions';
import { MinterRows } from '../types';

describe('Store w/minting-reducer', () => {
    it('should set-minting [rows]', () => {
        const state_0 = { rows: [] };
        const state_1 = mintingReducer(state_0, setMinting({
            rows: [MinterRows.empty()]
        }));
        expect(state_1.rows.length).toBeGreaterThan(0);
        expect(state_1.rows[0].disabled).toEqual(true);
        expect(state_1.rows[0].display).toEqual(false);
        expect(state_1.rows[0].nn_counter).toEqual(0);
        expect(state_1.rows[0].tx_counter).toEqual(0);
        expect(state_1.rows[0].status).toEqual(null);
    });
});
