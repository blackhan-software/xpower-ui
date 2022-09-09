import './wallet.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { Referable } from '../../source/functions';
import { MiningManager } from '../../source/managers';
import { Token } from '../../source/redux/types';
import { OtfWallet } from '../../source/wallet';

import React, { } from 'react';
import { AftWalletUi } from './aft-wallet-ui';
import { OtfWalletUi } from './otf-wallet-ui';
import { CSSTransition } from 'react-transition-group';

type Props = {
    token: Token;
}
type State = {
    toggled: boolean;
}
export class WalletUi extends Referable(React.Component)<
    Props, State
> {
    constructor(
        props: Props
    ) {
        super(props);
        this.state = {
            toggled: OtfWallet.enabled
        };
    }
    render() {
        const { token } = this.props;
        const { toggled } = this.state;
        return <React.Fragment>
            <AftWalletUi
                onToggled={(toggled) => this.onToggled({ toggled })}
                toggled={toggled} token={token}
            ></AftWalletUi>
            <CSSTransition
                nodeRef={this.global_ref<HTMLElement>('otf-wallet')}
                in={toggled} timeout={600} classNames='fade-in-600'
            >
                <OtfWalletUi toggled={toggled}></OtfWalletUi>
            </CSSTransition>
        </React.Fragment>;
    }
    componentDidMount() {
        if (this.on_toggled === undefined) {
            this.on_toggled = this.onToggled.bind(this);
            OtfWallet.onToggled(this.on_toggled);
        }
    }
    componentWillUnmount() {
        if (this.on_toggled) {
            OtfWallet.unToggled(this.on_toggled);
        }
    }
    componentDidUpdate() {
        OtfWallet.enabled = this.state.toggled;
    }
    onToggled({ toggled }: { toggled: boolean }) {
        this.setState({ toggled });
    }
    on_toggled?: ({ toggled }: { toggled: boolean }) => void;
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
