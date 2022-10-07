import { Blockchain } from '../../source/blockchain';
import { buffered, x40 } from '../../source/functions';
import { setAftWallet, setOtfWalletAddress, setOtfWalletAmount } from '../../source/redux/actions';
import { otfWalletOf, tokenOf } from '../../source/redux/selectors';
import { Store } from '../../source/redux/store';
import { MoeWallet, OnTransfer, OtfManager } from '../../source/wallet';
/**
 * aft-wallet:
 */
Blockchain.onceConnect(async function initAftWallet({
    address, token
}) {
    const moe_wallet = new MoeWallet(address, token);
    const [amount, supply] = await Promise.all([
        moe_wallet.balance, moe_wallet.supply
    ]);
    Store.dispatch(setAftWallet(
        token, { amount, supply }
    ));
}, {
    per: () => tokenOf(Store.state)
});
Blockchain.onceConnect(function syncAftWallet({
    address, token
}) {
    const on_transfer: OnTransfer = async (
        from, to, amount
    ) => {
        if (tokenOf(Store.state) !== token) {
            return;
        }
        console.debug(
            '[on:transfer]', x40(from), x40(to), amount
        );
        if (address === from || address === to) {
            const [amount, supply] = await Promise.all([
                moe_wallet.balance, moe_wallet.supply
            ]);
            Store.dispatch(setAftWallet(
                token, { amount, supply }
            ));
        }
    };
    const moe_wallet = new MoeWallet(address, token);
    moe_wallet.onTransfer(on_transfer);
}, {
    per: () => tokenOf(Store.state)
});
/**
 * otf-wallet:
 */
Blockchain.onceConnect(async function initOtfWallet() {
    const otf_wallet = await OtfManager.init();
    const [otf_address, otf_balance] = await Promise.all([
        otf_wallet.getAddress(), otf_wallet.getBalance()
    ]);
    Store.dispatch(setOtfWalletAddress({
        address: BigInt(otf_address)
    }));
    Store.dispatch(setOtfWalletAmount({
        amount: otf_balance.toBigInt()
    }));
});
Blockchain.onceConnect(async function syncOtfWallet() {
    const otf_wallet = await OtfManager.init();
    otf_wallet.provider?.on('block', buffered(() => {
        if (OtfManager.enabled) on_block();
    }));
    async function on_block() {
        const otf_balance = await otf_wallet.getBalance();
        const otf_amount = otf_balance.toBigInt();
        const { amount } = otfWalletOf(Store.state);
        if (amount !== otf_amount) {
            Store.dispatch(setOtfWalletAmount({
                amount: otf_amount
            }));
        }
    }
});
