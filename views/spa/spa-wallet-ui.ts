import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { buffered } from '../../source/functions';
import { OtfWallet } from '../../source/wallet';
/**
 * otf-wallet:
 */
Blockchain.onceConnect(async function init() {
    const otf_wallet = await OtfWallet.init();
    const [otf_address, otf_balance] = await Promise.all([
        otf_wallet.getAddress(), otf_wallet.getBalance()
    ]);
    App.setWalletUi({
        otf: {
            address: BigInt(otf_address),
            amount: otf_balance.toBigInt()
        }
    });
});
Blockchain.onceConnect(async function sync() {
    const otf_wallet = await OtfWallet.init();
    otf_wallet.provider?.on('block', buffered(() => {
        if (OtfWallet.enabled) on_block();
    }));
    async function on_block() {
        const otf_balance = await otf_wallet.getBalance();
        const otf_amount = otf_balance.toBigInt();
        const { otf } = App.getWalletUi();
        if (otf.amount !== otf_amount) {
            App.setWalletUi({ otf: { amount: otf_amount } });
        }
    }
});
