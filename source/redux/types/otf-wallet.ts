import { Address, Amount } from './base';

export type OtfWallet = {
    address: Address | null;
    amount: Amount | null;
    processing: boolean | null;
    toggled: boolean | null;
}
export default OtfWallet;
