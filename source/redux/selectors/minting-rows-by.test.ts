import { mintingRowsBy } from './minting-rows-by';

describe('mintingRowBy', () => {
    const rows = {
        [0]: {
            disabled: false,
            display: false,
            ignored: false,
            nn_counter: 0,
            tx_counter: 1,
            status: null,
        },
        [1]: {
            disabled: true,
            display: true,
            ignored: true,
            nn_counter: 2,
            tx_counter: 3,
            status: null,
        },
    };
    it('should return some rows', () => {
        expect(mintingRowsBy({
            minting: { rows }
        }, {
            disabled: true,
        })).toEqual([[1, {
            disabled: true,
            display: true,
            ignored: true,
            nn_counter: 2,
            tx_counter: 3,
            status: null,
        }]]);
    });
    it('should return all rows', () => {
        expect(mintingRowsBy({
            minting: { rows }
        }, {
        })).toEqual([[0, {
            disabled: false,
            display: false,
            ignored: false,
            nn_counter: 0,
            tx_counter: 1,
            status: null,
        }], [1, {
            disabled: true,
            display: true,
            ignored: true,
            nn_counter: 2,
            tx_counter: 3,
            status: null,
        }]]);
    });
    it('should return no rows', () => {
        expect(mintingRowsBy({
            minting: { rows: {} }
        }, {})).toEqual([]);
    });
});
