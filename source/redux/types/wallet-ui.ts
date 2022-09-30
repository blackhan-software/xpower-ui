import { Address, Amount } from "./base";

export type WalletUi ={
    otf: {
        address: Address | null;
        amount: Amount | null;
        processing: boolean;
    };
}
export default WalletUi;
