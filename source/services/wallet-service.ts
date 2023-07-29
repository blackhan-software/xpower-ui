import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { buffered, x40 } from '../functions';
import { ROParams } from '../params';
import { setAftWallet, setOtfWalletAccount, setOtfWalletAmount } from '../redux/actions';
import { atokenOf, otfWalletOf, xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Tokenizer } from '../token';
import { Version } from '../types';
import { MoeWallet, OnTransfer, OtfManager, SovWallet } from '../wallet';

const MoeWalletService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initMoeWallet({
        account, token
    }) {
        const xtoken = Tokenizer.xify(token);
        const moe_wallet = new MoeWallet(account, xtoken);
        const [a, s, c] = await Promise.all([
            moe_wallet.balance, moe_wallet.supply, 0n
        ]);
        store.dispatch(setAftWallet(
            xtoken, { amount: a, supply: s, collat: c }
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
                const [a, s, c] = await Promise.all([
                    moe_wallet.balance, moe_wallet.supply, 0n
                ]);
                store.dispatch(setAftWallet(
                    xtoken, { amount: a, supply: s, collat: c }
                ));
            }
        };
        const xtoken = Tokenizer.xify(token);
        const moe_wallet = new MoeWallet(account, xtoken);
        moe_wallet.onTransfer(on_transfer);
    }, {
        per: () => xtokenOf(store.getState())
    });
}
const SovWalletService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initSovWallet({
        account, token
    }) {
        const atoken = Tokenizer.aify(token);
        const sov_wallet = new SovWallet(account, atoken);
        const [a, s, c] = await Promise.all([
            sov_wallet.balance, sov_wallet.supply, sov_wallet.collat
        ]);
        store.dispatch(setAftWallet(
            atoken, { amount: a, supply: s, collat: c }
        ));
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
                const [a, s, c] = await Promise.all([
                    sov_wallet.balance, sov_wallet.supply, sov_wallet.collat
                ]);
                store.dispatch(setAftWallet(
                    atoken, { amount: a, supply: s, collat: c }
                ));
            }
        };
        const atoken = Tokenizer.aify(token);
        const sov_wallet = new SovWallet(account, atoken);
        sov_wallet.onTransfer(on_transfer);
    }, {
        per: () => xtokenOf(store.getState())
    });
}
const OtfWalletService = (
    store: Store<AppState>
) => {
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
export const WalletService = (
    store: Store<AppState>
) => {
    if (ROParams.service('moe-wallet')) {
        MoeWalletService(store);
    }
    if (ROParams.service('sov-wallet') && ROParams.version > Version.v4a) {
        SovWalletService(store);
    }
    if (ROParams.service('otf-wallet')) {
        OtfWalletService(store);
    }
}
export default WalletService;
