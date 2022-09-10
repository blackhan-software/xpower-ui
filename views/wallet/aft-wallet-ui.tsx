import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { nice, nice_si } from '../../filters';
import { Updatable, buffered, x40 } from '../../source/functions';
import { Address, Amount, Token, Tokens } from '../../source/redux/types';
import { MoeWallet, OnTransfer } from '../../source/wallet';
import { Tooltip } from '../tooltips';

import React from 'react';
import { InfoCircle } from '../../public/images/tsx';

type Props = {
    onToggled: (toggled: boolean) => void;
    toggled: boolean;
    token: Token;
}
type State = {
    address: Address | null;
    balance: Record<Token, Amount | null>;
}
function state() {
    return { address: null, balance: balance() };
}
function balance() {
    const balance = {} as State['balance'];
    for (const token of Tokens()) {
        balance[token] = null;
    }
    return balance;
}
export class AftWalletUi extends Updatable(
    React.Component<Props, State>
) {
    constructor(
        props: Props
    ) {
        super(props);
        this.state = state();
    }
    async componentDidMount() {
        const address = await Blockchain.selectedAddress;
        if (address) {
            this.setState({ address })
        } else {
            Blockchain.onceConnect(({ address }) =>
                this.setState({ address })
            );
        }
        App.onTokenChanged((token: Token, {
            amount: balance
        }) => {
            this.update({
                balance: { [token]: balance }
            });
        });
    }
    render() {
        const { toggled, token } = this.props;
        const { address, balance } = this.state;
        return <div id='aft-wallet'>
            <label className='form-label'>
                Wallet Address and {token} Balance
            </label>
            <div className='input-group wallet-address'>
                {this.$toggle(toggled)}
                {this.$address(address)}
                {this.$balance(balance[token], token)}
                {this.$info(token)}
            </div>
        </div>;
    }
    $toggle(
        toggled: boolean
    ) {
        return <button id='otf-wallet-toggle'
            className='form-control input-group-text'
            data-bs-toggle='tooltip' data-bs-placement='top'
            onClick={this.toggle.bind(this, toggled)}
            role='button'
            title={this.title(toggled)}
        >
            <i className={this.icon(toggled)} />
        </button>;
    }
    toggle(
        toggled: boolean
    ) {
        this.props.onToggled(!toggled);
    }
    title(
        toggled: boolean
    ) {
        if (toggled) {
            return 'Disable minter wallet & hide balance of AVAX';
        } else {
            return 'Enable minter wallet & show balance of AVAX';
        }
    }
    icon(
        toggled: boolean
    ) {
        return toggled ? 'bi-wallet2' : 'bi-wallet';
    }
    $address(
        address: Address | null
    ) {
        return <input readOnly
            className='form-control' id='aft-wallet-address'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Wallet address' type='text'
            value={x40(address ?? 0n)}
        />;
    }
    $balance(
        amount: Amount | null, token: Token
    ) {
        return <input readOnly
            className='form-control' id='aft-wallet-balance'
            data-bs-toggle='tooltip' data-bs-placement='top'
            type='text' value={nice_si(amount ?? 0n)}
            title={`${nice(amount ?? 0n)} ${token}`}
        />;
    }
    $info(
        token: Token
    ) {
        return <button role='tooltip'
            className='form-control input-group-text info'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title={`Wallet address & balance of ${token} tokens`}
        >
            {InfoCircle({ fill: true })}
        </button>;
    }
    componentDidUpdate = buffered(() => {
        const $otf_toggle = document.getElementById(
            'otf-wallet-toggle'
        );
        if ($otf_toggle) {
            Tooltip.getInstance($otf_toggle)?.dispose();
            Tooltip.getOrCreateInstance($otf_toggle);
        }
        const $aft_balance = document.getElementById(
            'aft-wallet-balance'
        );
        if ($aft_balance) {
            Tooltip.getInstance($aft_balance)?.dispose();
            Tooltip.getOrCreateInstance($aft_balance);
        }
    })
}
Blockchain.onceConnect(async function initialize({
    address, token
}) {
    const moe_wallet = new MoeWallet(address, token);
    const [amount, supply] = await Promise.all([
        moe_wallet.balance, moe_wallet.supply
    ]);
    App.setToken(token, { amount, supply });
}, {
    per: () => App.token
});
Blockchain.onConnect(function synchronize({
    token
}) {
    const tokens = App.getTokens(token);
    const item = tokens.items[token];
    if (item) {
        App.setToken(token, item);
    }
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
            App.setToken(token, { amount, supply });
        }
    };
    const moe_wallet = new MoeWallet(address, token);
    moe_wallet.onTransfer(on_transfer);
}, {
    per: () => App.token
});
export default AftWalletUi;
