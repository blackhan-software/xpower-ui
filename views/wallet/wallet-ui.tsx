import './wallet.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { MiningManager } from '../../source/managers';
import { Token } from '../../source/redux/types';
import { OtfWallet } from '../../source/wallet';

import React from 'react';
import { AftWalletUi } from './aft-wallet-ui';
import { OtfWalletUi } from './otf-wallet-ui';
import { CSSTransition } from 'react-transition-group';

type Props = {
    token: Token;
}
type State = {
    toggled: boolean;
}
export class WalletUi extends React.Component<
    Props, State
> {
    constructor(
        props: Props
    ) {
        super(props);
        this.state = {
            toggled: OtfWallet.enabled
        };
        this.events();
    }
    events() {
        OtfWallet.onToggled(({ toggled }) => {
            this.setState({ toggled });
        });
    }
    onToggled(toggled: boolean) {
        this.setState({ toggled });
    }
    render() {
        const { token } = this.props;
        const { toggled } = this.state;
        return <React.Fragment>
            <AftWalletUi
                onToggled={this.onToggled.bind(this)}
                toggled={toggled} token={token}
            ></AftWalletUi>
            <CSSTransition
                in={toggled} timeout={600} classNames='fade-in-600'
            >
                <OtfWalletUi toggled={toggled}></OtfWalletUi>
            </CSSTransition>
        </React.Fragment>;
    }
    componentDidUpdate() {
        OtfWallet.enabled = this.state.toggled;
    }
}
Blockchain.onceConnect(async function resumeMiningIf({
    address
}) {
    const on_block = async () => {
        if (OtfWallet.enabled) {
            const otf_balance = await otf_wallet.getBalance();
            if (otf_balance.gt(OtfWallet.threshold)) {
                const miner = MiningManager.miner(address, {
                    token: App.token
                });
                if (miner.running) {
                    miner.resume();
                }
            }
        }
    };
    const otf_wallet = await OtfWallet.init();
    otf_wallet.provider?.on('block', on_block);
});
export default WalletUi;
