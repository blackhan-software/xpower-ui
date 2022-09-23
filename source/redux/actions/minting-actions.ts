import { Minting } from "../types/minting";

export type SetMinting = {
    type: 'minting/set', payload: Partial<Minting>
};
export const setMinting = (payload: Partial<Minting>): SetMinting => ({
    type: 'minting/set', payload
});
export type Action = SetMinting;
