import { WSProvider } from '../blockchain';
import { XPowerMoe, XPowerMoeFactory } from '../contract';
import { Account, Address, BlockHash, Nonce, Timestamp, Token } from '../redux/types';
import { TxEvent, Version } from '../types';
import { ERC20Wallet, OnApproval, OnTransfer } from './erc20-wallet';

export { OnApproval, OnTransfer };
export type OnInit = (
    block_hash: BlockHash, timestamp: Timestamp, ev: TxEvent
) => void;

export class MoeWallet extends ERC20Wallet {
    constructor(
        account: Account | Address, token: Token, version?: Version
    ) {
        super(account);
        this._moe = XPowerMoeFactory({ token, version });
    }
    init() {
        return this._moe.init();
    }
    mint(
        block_hash: BlockHash, nonce: Nonce
    ) {
        return this._moe.mint(this.account, block_hash, nonce);
    }
    onInit(
        listener: OnInit, { once } = { once: false }
    ) {
        const on_init = (
            block_hash: string, timestamp: Timestamp, ev: TxEvent
        ) => {
            listener(BigInt(block_hash), timestamp, ev);
        };
        if (once) {
            this.wsc.then((c) => c.once('Init', on_init));
        } else {
            this.wsc.then((c) => c.on('Init', on_init));
        }
    }
    get mmc() {
        return this._moe.connect();
    }
    get wsc() {
        return WSProvider().then((wsp) => this._moe.connect(wsp));
    }
    private _moe: XPowerMoe;
}
export default MoeWallet;
