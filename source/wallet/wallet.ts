import { hex, x40, x64 } from '../functions';
import { BigNumber, Contract, Transaction, Event } from 'ethers';
import { Address, Allowance, Amount, Supply } from '../redux/types';
import { Balance, BlockHash, Nonce, Timestamp } from '../redux/types';
import { XPowerFactory } from '../xpower';
import { OnInit as on_init } from '../xpower';
import { OnApproval as on_approval } from '../xpower';
import { OnTransfer as on_transfer } from '../xpower';

export type OnInit = (
    block_hash: BlockHash, timestamp: Timestamp, ev: Event
) => void;
export type OnApproval = (
    owner: Address, spender: Address, value: Amount, ev: Event
) => void;
export type OnTransfer = (
    from: Address, to: Address, amount: Amount, ev: Event
) => void;

export class Wallet {
    constructor(
        address: Address | string
    ) {
        if (typeof address === 'bigint') {
            address = x40(address);
        }
        if (!address.match(/^0x/)) {
            throw new Error(`address prefix is not 0x`);
        }
        if (address.length !== 42) {
            throw new Error(`address length is not 42`);
        }
        this._address = address;
    }
    async allowance(
        address: Address | string, spender_address: Address | string
    ): Promise<Allowance> {
        if (typeof address === 'bigint') {
            address = x40(address);
        }
        if (typeof spender_address === 'bigint') {
            spender_address = x40(spender_address);
        }
        const allowance: BigNumber = await this.contract.allowance(
            address, spender_address
        );
        return allowance.toBigInt();
    }
    increaseAllowance(
        spender_address: Address | string, allowance: Allowance
    ): Promise<Transaction> {
        if (typeof spender_address === 'bigint') {
            spender_address = x40(spender_address);
        }
        return this.contract.increaseAllowance(
            spender_address, allowance
        );
    }
    init(): Promise<Transaction> {
        return this.contract.init();
    }
    mint(
        nonce: Nonce, block_hash: BlockHash
    ): Promise<Transaction> {
        return this.contract.mint(
            hex(nonce), x64(block_hash)
        );
    }
    onInit(
        handler: OnInit, { once } = { once: false }
    ) {
        const on_init: on_init = (
            block_hash, timestamp, ev
        ) => {
            handler(BigInt(block_hash), timestamp.toBigInt(), ev);
        };
        if (once) {
            this.contract.once('Init', on_init);
        } else {
            this.contract.on('Init', on_init);
        }
    }
    onApproval(
        handler: OnApproval, { once } = { once: false }
    ) {
        const on_approval: on_approval = (
            owner, spender, value, ev
        ) => {
            handler(BigInt(owner), BigInt(spender), value.toBigInt(), ev);
        };
        if (once) {
            this.contract.once('Approval', on_approval);
        } else {
            this.contract.on('Approval', on_approval);
        }
    }
    onTransfer(
        handler: OnTransfer, { once } = { once: false }
    ) {
        const on_transfer: on_transfer = (
            from, to, amount, ev
        ) => {
            if (this._address.match(new RegExp(from, 'i')) ||
                this._address.match(new RegExp(to, 'i'))
            ) {
                handler(BigInt(from), BigInt(to), amount.toBigInt(), ev);
            }
        };
        if (once) {
            this.contract.once('Transfer', on_transfer);
        } else {
            this.contract.on('Transfer', on_transfer);
        }
    }
    get address(): Address | string {
        return BigInt(this._address);
    }
    get balance(): Promise<Balance> {
        const balance = this.contract.balanceOf(this._address);
        return balance.then((b: BigNumber) => b.toBigInt());
    }
    get supply(): Promise<Supply> {
        const supply = this.contract.totalSupply();
        return supply.then((s: BigNumber) => s.toBigInt());
    }
    get contract(): Contract {
        if (this._xpower === undefined) {
            this._xpower = XPowerFactory();
        }
        return this._xpower;
    }
    protected _address: string;
    protected _xpower: Contract | undefined;
}
export default Wallet;
