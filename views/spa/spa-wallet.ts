import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { x40 } from '../../source/functions';
import { MoeWallet, OnTransfer } from '../../source/wallet';

Blockchain.onceConnect(async function init({
    address, token
}) {
    const moe_wallet = new MoeWallet(address, token);
    const [amount, supply] = await Promise.all([
        moe_wallet.balance, moe_wallet.supply
    ]);
    App.setWallet(token, { amount, supply });
}, {
    per: () => App.token
});
Blockchain.onceConnect(function onTransfer({
    address, token
}) {
    const on_transfer: OnTransfer = async (
        from, to, amount
    ) => {
        if (App.token !== token) {
            return;
        }
        console.debug(
            '[on:transfer]', x40(from), x40(to), amount
        );
        if (address === from || address === to) {
            const [amount, supply] = await Promise.all([
                moe_wallet.balance, moe_wallet.supply
            ]);
            App.setWallet(token, { amount, supply });
        }
    };
    const moe_wallet = new MoeWallet(address, token);
    moe_wallet.onTransfer(on_transfer);
}, {
    per: () => App.token
});
