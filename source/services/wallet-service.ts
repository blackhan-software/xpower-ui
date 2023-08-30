import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { buffered, x40 } from '../functions';
import { ROParams } from '../params';
import { setAftWallet, setOtfWalletAccount, setOtfWalletAmount } from '../redux/actions';
import { otfWalletOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Token } from '../redux/types';
import { Version } from '../types';
import { MoeWallet, OnTransfer, OtfManager, SovWallet } from '../wallet';

const MoeWalletService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initMoeWallet({
        account
    }) {
        const moe_wallet = new MoeWallet(account);
        const [a, s, c] = await Promise.all([
            moe_wallet.balance, moe_wallet.supply, 0n
        ]);
        store.dispatch(setAftWallet(
            Token.XPOW, { amount: a, supply: s, collat: c }
        ));
    });
    Blockchain.onceConnect(function syncMoeWallet({
        account
    }) {
        const on_transfer: OnTransfer = async (
            from, to, amount
        ) => {
            console.debug(
                '[on:transfer]', x40(from), x40(to), amount
            );
            if (account === from || account === to) {
                const [a, s, c] = await Promise.all([
                    moe_wallet.balance, moe_wallet.supply, 0n
                ]);
                store.dispatch(setAftWallet(
                    Token.XPOW, { amount: a, supply: s, collat: c }
                ));
            }
        };
        const moe_wallet = new MoeWallet(account);
        moe_wallet.onTransfer(on_transfer);
    });
}
const SovWalletService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initSovWallet({
        account
    }) {
        const sov_wallet = new SovWallet(account);
        const [a, s, c] = await Promise.all([
            sov_wallet.balance, sov_wallet.supply, sov_wallet.collat
        ]);
        store.dispatch(setAftWallet(
            Token.APOW, { amount: a, supply: s, collat: c }
        ));
    });
    Blockchain.onceConnect(function syncSovWallet({
        account
    }) {
        const on_transfer: OnTransfer = async (
            from, to, amount
        ) => {
            console.debug(
                '[on:transfer]', x40(from), x40(to), amount
            );
            if (account === from || account === to) {
                const [a, s, c] = await Promise.all([
                    sov_wallet.balance, sov_wallet.supply, sov_wallet.collat
                ]);
                store.dispatch(setAftWallet(
                    Token.APOW, { amount: a, supply: s, collat: c }
                ));
            }
        };
        const sov_wallet = new SovWallet(account);
        sov_wallet.onTransfer(on_transfer);
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
    if (ROParams.service('sov-wallet') && ROParams.gt(Version.v4a)) {
        SovWalletService(store);
    }
    if (ROParams.service('otf-wallet')) {
        OtfWalletService(store);
    }
}
export default WalletService;
