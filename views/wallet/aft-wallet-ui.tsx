import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { nice, nice_si } from '../../source/functions';
import { Updatable, x40 } from '../../source/functions';
import { Address, Amount, Token, Tokens } from '../../source/redux/types';
import { MoeWallet, OnTransfer } from '../../source/wallet';

import React from 'react';
import { XPower } from '../../public/images/tsx';

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
            role='button' title={this.title(toggled)}
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
        return <input type='text' readOnly
            className='form-control' id='aft-wallet-address'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Wallet address'
            value={x40(address ?? 0n)}
        />;
    }
    $balance(
        amount: Amount | null, token: Token
    ) {
        return <input type='text' readOnly
            className='form-control' id='aft-wallet-balance'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title={`${nice(amount ?? 0n)} ${token}`}
            value={nice_si(amount ?? 0n)}
        />;
    }
    $info(
        token: Token
    ) {
        return <button role='tooltip'
            className='form-control input-group-text info'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title={`Balance of proof-of-work ${token} tokens`}
        >
            <XPower token={token} style={{
                margin: 'auto', borderRadius: '8px'
            }} />
        </button>;
    }
    componentDidUpdate() {
        App.event.emit('refresh-tips');
    }
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
