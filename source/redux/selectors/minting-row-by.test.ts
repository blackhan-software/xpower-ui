import { mintingRowBy } from './minting-row-by';

describe('mintingRowBy', () => {
    it('should return a row [level==0]', () => {
        expect(mintingRowBy({
            minting: {
                rows: {
                    [0]: {
                        disabled: false,
                        display: false,
                        nn_counter: 0,
                        status: null,
                        tx_counter: 0,
                    }
                }
            }
        }, 0)).not.toEqual(undefined);
    });
    it('should return undefined [level==1]', () => {
        expect(mintingRowBy({
            minting: { rows: {} }
        }, 1)).toEqual(undefined);
    });
});
