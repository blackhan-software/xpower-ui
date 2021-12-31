import './wallet.scss';

import { Address, Amount, Token } from '../../source/redux/types';
import { OnTransfer, Wallet } from '../../source/wallet';
import { hex_40 } from '../../source/functions';
import { Tokenizer } from '../../source/token';
import { App } from '../../source/app';

$('#connect-metamask').on('connected', async function initWallet(ev, {
    address
}: {
    address: Address
}) {
    const token = Tokenizer.token(App.params.get('token'));
    const wallet = new Wallet(address);
    App.setToken(token, {
        amount: await wallet.balance,
        supply: await wallet.supply
    });
    const $address = $('#wallet-address');
    $address.val(hex_40(address));
});
$('#connect-metamask').on('connected', async function onTransfer(ev, {
    address
}: {
    address: Address
}) {
    const on_transfer: OnTransfer = async (from, to, amount) => {
        console.debug('[on:transfer]', hex_40(from), hex_40(to), amount);
        if (address === from || address === to) {
            App.setToken(token, {
                amount: await wallet.balance,
                supply: await wallet.supply
            });
        }
    };
    const token = Tokenizer.token(App.params.get('token'));
    const wallet = new Wallet(address);
    wallet.onTransfer(on_transfer);
});
App.onTokenChanged(function setBalance(
    token: Token, { amount: balance }: { amount: Amount }
) {
    const $balance = $('#wallet-balance');
    $balance.val(balance.toString());
});
export default Wallet;
