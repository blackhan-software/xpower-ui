import { Address, Amount } from './base';

export type OtfWallet = {
    address: Address | null;
    amount: Amount | null;
    processing: boolean;
}
export default OtfWallet;
