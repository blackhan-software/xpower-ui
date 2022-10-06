import { clearMintingRows, clearMintingRow, setMinting, setMintingRow } from '../actions';
import { mintingReducer, mintingState } from './minting-reducer';

describe('Store w/minting-reducer', () => {
    it('should clear-minting-rows [level=all]', () => {
        const state_0 = mintingState();
        const state_1 = mintingReducer(state_0, clearMintingRows());
        expect(state_1.rows[1].disabled).toEqual(true);
        expect(state_1.rows[1].display).toEqual(false);
        expect(state_1.rows[1].nn_counter).toEqual(0);
        expect(state_1.rows[1].tx_counter).toEqual(0);
        expect(state_1.rows[1].status).toEqual(null);
    });
    it('should clear-minting-row [level=1]', () => {
        const state_0 = mintingState();
        const state_1 = mintingReducer(state_0, clearMintingRow({
            level: 1
        }));
        expect(state_1.rows[1].disabled).toEqual(true);
        expect(state_1.rows[1].display).toEqual(false);
        expect(state_1.rows[1].nn_counter).toEqual(0);
        expect(state_1.rows[1].tx_counter).toEqual(0);
        expect(state_1.rows[1].status).toEqual(null);
    });
    it('should set-minting-row [level=1]', () => {
        const state_0 = mintingState();
        const state_1 = mintingReducer(state_0, setMintingRow({
            level: 1, row: {
                status: null,
                disabled: true,
                display: false,
                nn_counter: 0,
                tx_counter: 0,
            }
        }));
        expect(state_1.rows[1].disabled).toEqual(true);
        expect(state_1.rows[1].display).toEqual(false);
        expect(state_1.rows[1].nn_counter).toEqual(0);
        expect(state_1.rows[1].tx_counter).toEqual(0);
        expect(state_1.rows[1].status).toEqual(null);
    });
    it('should set-minting [rows]', () => {
        const state_0 = mintingState();
        const state_1 = mintingReducer(state_0, setMinting({
            rows: {
                1: {
                    status: null,
                    disabled: true,
                    display: false,
                    nn_counter: 0,
                    tx_counter: 0,
                }
            }
        }));
        expect(state_1.rows[1].disabled).toEqual(true);
        expect(state_1.rows[1].display).toEqual(false);
        expect(state_1.rows[1].nn_counter).toEqual(0);
        expect(state_1.rows[1].tx_counter).toEqual(0);
        expect(state_1.rows[1].status).toEqual(null);
    });
});
