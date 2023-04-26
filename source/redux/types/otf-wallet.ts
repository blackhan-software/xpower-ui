import { Account, Amount } from './base';

export type OtfWallet = {
    account: Account | null;
    amount: Amount | null;
    processing: boolean | null;
    toggled: boolean | null;
}
export default OtfWallet;
