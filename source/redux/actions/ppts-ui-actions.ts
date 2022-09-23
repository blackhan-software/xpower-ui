import { DeepPartial } from 'redux';
import { PptsUi } from '../types/ppts-ui';

export type SetPptsUi = {
    type: 'ppts-ui/set', payload: DeepPartial<PptsUi>
};
export const setPptsUi = (payload: DeepPartial<PptsUi>): SetPptsUi => ({
    type: 'ppts-ui/set', payload
});
export type Action = SetPptsUi;
