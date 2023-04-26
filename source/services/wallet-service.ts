import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { buffered, x40 } from '../functions';
import { setAftWallet, setOtfWalletAccount, setOtfWalletAmount } from '../redux/actions';
import { atokenOf, otfWalletOf, xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Tokenizer } from '../token';
import { MoeWallet, OnTransfer, OtfManager, SovWallet } from '../wallet';

export const WalletService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initMoeWallet({
        account, token
    }) {
        const xtoken = Tokenizer.xify(token);
        const moe_wallet = new MoeWallet(account, xtoken);
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
        account, token
    }) {
        const atoken = Tokenizer.aify(token);
        const sov_wallet = new SovWallet(account, atoken);
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
        account, token
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
            if (account === from || account === to) {
                const [amount, supply] = await Promise.all([
                    moe_wallet.balance, moe_wallet.supply
                ]);
                store.dispatch(setAftWallet(
                    xtoken, { amount, supply }
                ));
            }
        };
        const xtoken = Tokenizer.xify(token);
        const moe_wallet = new MoeWallet(account, xtoken);
        moe_wallet.onTransfer(on_transfer);
    }, {
        per: () => xtokenOf(store.getState())
    });
    Blockchain.onceConnect(function syncSovWallet({
        account, token
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
            if (account === from || account === to) {
                const [amount, supply] = await Promise.all([
                    sov_wallet.balance, sov_wallet.supply
                ]);
                store.dispatch(setAftWallet(
                    atoken, { amount, supply }
                ));
            }
        };
        const atoken = Tokenizer.aify(token);
        const sov_wallet = new SovWallet(account, atoken);
        sov_wallet.onTransfer(on_transfer);
    }, {
        per: () => xtokenOf(store.getState())
    });
    Blockchain.onceConnect(async function initOtfWallet() {
        const otf_wallet = await OtfManager.init();
        const [otf_address, otf_balance] = await Promise.all([
            otf_wallet.getAddress(), OtfManager.getBalance()
        ]);
        store.dispatch(setOtfWalletAccount({
            account: BigInt(otf_address)
        }));
        store.dispatch(setOtfWalletAmount({
            amount: otf_balance
        }));
    });
    Blockchain.onceConnect(async function syncOtfWallet() {
        const otf_wallet = await OtfManager.init();
        otf_wallet.provider?.on('block', buffered(() => {
            if (OtfManager.enabled) on_block();
        }));
        async function on_block() {
            const otf_balance = await OtfManager.getBalance();
            const { amount } = otfWalletOf(store.getState());
            if (amount !== otf_balance) {
                store.dispatch(setOtfWalletAmount({
                    amount: otf_balance
                }));
            }
        }
    });
}
export default WalletService;
