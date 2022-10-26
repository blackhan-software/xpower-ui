import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { buffered, x40 } from '../functions';
import { setAftWallet, setOtfWalletAddress, setOtfWalletAmount } from '../redux/actions';
import { atokenOf, otfWalletOf, xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Tokenizer } from '../token';
import { MoeWallet, OnTransfer, OtfManager, SovWallet } from '../wallet';

export const WalletService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initMoeWallet({
        address, token
    }) {
        const xtoken = Tokenizer.xify(token);
        const moe_wallet = new MoeWallet(address, xtoken);
        const [amount, supply] = await Promise.all([
            moe_wallet.balance, moe_wallet.supply
        ]);
        store.dispatch(setAftWallet(
            xtoken, { amount, supply }
        ));
    }, {
        per: () => xtokenOf(store.getState())
    });
    Blockchain.onceConnect(async function initMoeWallet({
        address, token
    }) {
        const atoken = Tokenizer.aify(token);
        const sov_wallet = new SovWallet(address, atoken);
        const [amount, supply] = await Promise.all([
            sov_wallet.balance, sov_wallet.supply
        ]);
        store.dispatch(setAftWallet(
            atoken, { amount, supply }
        ));
    }, {
        per: () => xtokenOf(store.getState())
    });
    Blockchain.onceConnect(function syncMoeWallet({
        address, token
    }) {
        const on_transfer: OnTransfer = async (
            from, to, amount
        ) => {
            if (xtokenOf(store.getState()) !== xtoken) {
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
                    xtoken, { amount, supply }
                ));
            }
        };
        const xtoken = Tokenizer.xify(token);
        const moe_wallet = new MoeWallet(address, xtoken);
        moe_wallet.onTransfer(on_transfer);
    }, {
        per: () => xtokenOf(store.getState())
    });
    Blockchain.onceConnect(function syncSovWallet({
        address, token
    }) {
        const on_transfer: OnTransfer = async (
            from, to, amount
        ) => {
            if (atokenOf(store.getState()) !== atoken) {
                return;
            }
            console.debug(
                '[on:transfer]', x40(from), x40(to), amount
            );
            if (address === from || address === to) {
                const [amount, supply] = await Promise.all([
                    sov_wallet.balance, sov_wallet.supply
                ]);
                store.dispatch(setAftWallet(
                    atoken, { amount, supply }
                ));
            }
        };
        const atoken = Tokenizer.aify(token);
        const sov_wallet = new SovWallet(address, atoken);
        sov_wallet.onTransfer(on_transfer);
    }, {
        per: () => xtokenOf(store.getState())
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
