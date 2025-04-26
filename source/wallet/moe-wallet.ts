import { ErrorDescription } from 'ethers';
import { MYProvider } from '../blockchain';
import { XPowerMoe, XPowerMoeFactory } from '../contract';
import { Account, Address, BlockHash, Nonce, Timestamp } from '../redux/types';
import { TxEvent, Version } from '../types';
import { ERC20Wallet, OnApproval, OnTransfer } from './erc20-wallet';

export { OnApproval, OnTransfer };

export type OnInit = (
    block_hash: BlockHash, timestamp: Timestamp, ev: TxEvent
) => void;
export type OnApproveMigrate = (
    account: Account, operator: Account, approved: boolean, ev: TxEvent
) => void;

export class MoeWallet extends ERC20Wallet {
    constructor(
        account: Account | Address, version?: Version
    ) {
        super(account);
        if (version) {
            this._moe = XPowerMoeFactory({ version });
        } else {
            this._moe = XPowerMoeFactory();
        }
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
            this.get.then((c) => c.once('Init', on_init));
        } else {
            this.get.then((c) => c.on('Init', on_init));
        }
    }
    approvedMigrate(
        account: Address, operator: Address
    ) {
        return this._moe.approvedMigrate(
            BigInt(account), BigInt(operator)
        );
    }
    approveMigrate(
        operator: Address, approved: boolean
    ) {
        return this._moe.approveMigrate(
            BigInt(operator), approved
        );
    }
    onApproveMigrate(
        listener: OnApproveMigrate, { once } = { once: false }
    ) {
        const on_approve = (
            account: Account, operator: Account, approved: boolean, ev: TxEvent
        ) => {
            listener(account, operator, approved, ev);
        };
        if (once) {
            this.get.then((c) => c.once('ApproveMigrate', on_approve));
        } else {
            this.get.then((c) => c.on('ApproveMigrate', on_approve));
        }
    }
    public parse(e: unknown): ErrorDescription | unknown {
        return this._moe.parse(e);
    }
    get put() {
        return this._moe.connect();
    }
    get get() {
        return MYProvider().then((p) => this._moe.connect(p));
    }
    private _moe: XPowerMoe;
}
export default MoeWallet;
