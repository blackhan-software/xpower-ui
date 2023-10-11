import AftWallet from "./aft-wallet"
import OtfWallet from "./otf-wallet";

export type Wallet = {
    aft_wallet: AftWallet;
    otf_wallet: OtfWallet;
}
export default Wallet;
