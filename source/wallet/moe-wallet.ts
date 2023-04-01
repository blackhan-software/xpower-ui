import { BigNumber, Contract, Event, Transaction } from 'ethers';
import { XPowerMoe, XPowerMoeFactory } from '../contract';
import { Address, BlockHash, Nonce, Timestamp, Token } from '../redux/types';
import { ERC20Wallet, OnApproval, OnTransfer } from './erc20-wallet';

export { OnApproval, OnTransfer };
export type OnInit = (
    block_hash: BlockHash, timestamp: Timestamp, ev: Event
) => void;

export class MoeWallet extends ERC20Wallet {
    constructor(
        address: Address | string, token: Token
    ) {
        super(address);
        this._moe = XPowerMoeFactory({ token });
    }
    init(): Promise<Transaction> {
        return this._moe.init();
    }
    mint(
        block_hash: BlockHash, nonce: Nonce
    ): Promise<Transaction> {
        return this._moe.mint(this.address, block_hash, nonce);
    }
    onInit(
        listener: OnInit, { once } = { once: false }
    ) {
        const on_init = (
            block_hash: string, timestamp: BigNumber, ev: Event
        ) => {
            listener(BigInt(block_hash), timestamp.toBigInt(), ev);
        };
        if (once) {
            this.contract.then((c) => c.once('Init', on_init));
        } else {
            this.contract.then((c) => c.on('Init', on_init));
        }
    }
    get contract(): Promise<Contract> {
        if (this._contract === undefined) {
            const connected = this._moe.connect();
            return connected.then((c) => (this._contract = c));
        }
        return Promise.resolve(this._contract);
    }
    private _contract: Contract | undefined;
    private _moe: XPowerMoe;
}
export default MoeWallet;
