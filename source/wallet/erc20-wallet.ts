import { BigNumber, Contract, Event, Transaction } from 'ethers';
import { x40 } from '../functions';
import { Address, Allowance, Amount, Balance, Decimals, Supply } from '../redux/types';

export type OnApproval = (
    owner: Address, spender: Address, value: Amount, ev: Event
) => void;
export type OnTransfer = (
    from: Address, to: Address, amount: Amount, ev: Event
) => void;

export abstract class ERC20Wallet {
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
    async burn(
        amount: Amount
    ): Promise<Transaction> {
        return this.contract.then((c) => c.burn(amount));
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
        const allowance: BigNumber = await this.contract.then((c) => c.allowance(
            address, spender_address
        ));
        return allowance.toBigInt();
    }
    async approve(
        spender_address: Address | string, allowance: Allowance
    ): Promise<Transaction> {
        if (typeof spender_address === 'bigint') {
            spender_address = x40(spender_address);
        }
        return this.contract.then((c) => c.approve(
            spender_address, allowance
        ));
    }
    async increaseAllowance(
        spender_address: Address | string, delta_allowance: Allowance
    ): Promise<Transaction> {
        if (typeof spender_address === 'bigint') {
            spender_address = x40(spender_address);
        }
        return this.contract.then((c) => c.increaseAllowance(
            spender_address, delta_allowance
        ));
    }
    async decreaseAllowance(
        spender_address: Address | string, delta_allowance: Allowance
    ): Promise<Transaction> {
        if (typeof spender_address === 'bigint') {
            spender_address = x40(spender_address);
        }
        return this.contract.then((c) => c.decreaseAllowance(
            spender_address, delta_allowance
        ));
    }
    onApproval(
        handler: OnApproval, { once } = { once: false }
    ) {
        const on_approval = (
            owner: string, spender: string, value: BigNumber, ev: Event
        ) => {
            handler(BigInt(owner), BigInt(spender), value.toBigInt(), ev);
        };
        if (once) {
            this.contract.then((c) => c.once('Approval', on_approval));
        } else {
            this.contract.then((c) => c.on('Approval', on_approval));
        }
    }
    onTransfer(
        listener: OnTransfer, { once } = { once: false }
    ) {
        const on_transfer = (
            from: string, to: string, amount: BigNumber, ev: Event
        ) => {
            if (this._address.match(new RegExp(from, 'i')) ||
                this._address.match(new RegExp(to, 'i'))
            ) {
                listener(BigInt(from), BigInt(to), amount.toBigInt(), ev);
            }
        };
        if (once) {
            this.contract.then((c) => c.once('Transfer', on_transfer));
        } else {
            this.contract.then((c) => c.on('Transfer', on_transfer));
        }
        return listener;
    }
    get address(): Address {
        return BigInt(this._address);
    }
    get balance(): Promise<Balance> {
        const balance = this.contract.then((c) => c.balanceOf(this._address));
        return balance.then((b: BigNumber) => b.toBigInt());
    }
    get supply(): Promise<Supply> {
        const supply = this.contract.then((c) => c.totalSupply());
        return supply.then((s: BigNumber) => s.toBigInt());
    }
    get decimals(): Promise<Decimals> {
        const decimals = this.contract.then((c) => c.decimals());
        return decimals.then((d: number) => d);
    }
    abstract get contract(): Promise<Contract>;
    private readonly _address: string;
}
export default ERC20Wallet;
