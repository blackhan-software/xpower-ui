import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { buffered, x40 } from '../functions';
import { MoeWallet, OnTransfer, OtfManager } from '../wallet';
import { setAftWallet, setOtfWalletAddress, setOtfWalletAmount } from '../redux/actions';
import { otfWalletOf, tokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';

export const WalletService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initAftWallet({
        address, token
    }) {
        const moe_wallet = new MoeWallet(address, token);
        const [amount, supply] = await Promise.all([
            moe_wallet.balance, moe_wallet.supply
        ]);
        store.dispatch(setAftWallet(
            token, { amount, supply }
        ));
    }, {
        per: () => tokenOf(store.getState())
    });
    Blockchain.onceConnect(function syncAftWallet({
        address, token
    }) {
        const on_transfer: OnTransfer = async (
            from, to, amount
        ) => {
            if (tokenOf(store.getState()) !== token) {
                return;
            }
            console.debug(
                '[on:transfer]', x40(from), x40(to), amount
            );
            if (address === from || address === to) {
                const [amount, supply] = await Promise.all([
                    moe_wallet.balance, moe_wallet.supply
                ]);
                store.dispatch(setAftWallet(
                    token, { amount, supply }
                ));
            }
        };
        const moe_wallet = new MoeWallet(address, token);
        moe_wallet.onTransfer(on_transfer);
    }, {
        per: () => tokenOf(store.getState())
    });
    Blockchain.onceConnect(async function initOtfWallet() {
        const otf_wallet = await OtfManager.init();
        const [otf_address, otf_balance] = await Promise.all([
            otf_wallet.getAddress(), otf_wallet.getBalance()
        ]);
        store.dispatch(setOtfWalletAddress({
            address: BigInt(otf_address)
        }));
        store.dispatch(setOtfWalletAmount({
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
            const { amount } = otfWalletOf(store.getState());
            if (amount !== otf_amount) {
                store.dispatch(setOtfWalletAmount({
                    amount: otf_amount
                }));
            }
        }
    });
}
export default WalletService;
