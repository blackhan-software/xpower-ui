import { Contract, TransactionResponse } from 'ethers';
import { x40 } from '../functions';
import { Account, Address, Allowance, Amount, Balance, Decimals, Supply } from '../redux/types';
import { TxEvent } from '../types';

export type OnApproval = (
    owner: Account, spender: Account, value: Amount, ev: TxEvent
) => void;
export type OnTransfer = (
    from: Account, to: Account, amount: Amount, ev: TxEvent
) => void;

export abstract class ERC20Wallet {
    constructor(
        account: Account | Address
    ) {
        if (typeof account === 'bigint') {
            this._account = x40(account);
        } else {
            this._account = account;
        }
        if (!this._account.match(/^0x/)) {
            throw new Error(`address prefix is not 0x`);
        }
        if (this._account.length !== 42) {
            throw new Error(`address length is not 42`);
        }
    }
    async burn(
        amount: Amount
    ): Promise<TransactionResponse> {
        return this.put.then((c) => c.burn(amount));
    }
    async allowance(
        address: Account | Address, spender_address: Account | Address
    ): Promise<Allowance> {
        if (typeof address === 'bigint') {
            address = x40(address);
        }
        if (typeof spender_address === 'bigint') {
            spender_address = x40(spender_address);
        }
        return this.get.then((c) => c.allowance(
            address, spender_address
        ));
    }
    async approve(
        spender_address: Account | Address, allowance: Allowance
    ): Promise<TransactionResponse> {
        if (typeof spender_address === 'bigint') {
            spender_address = x40(spender_address);
        }
        return this.put.then((c) => c.approve(
            spender_address, allowance
        ));
    }
    async increaseAllowance(
        spender_address: Account | Address, delta_allowance: Allowance
    ): Promise<TransactionResponse> {
        if (typeof spender_address === 'bigint') {
            spender_address = x40(spender_address);
        }
        return this.put.then((c) => c.increaseAllowance(
            spender_address, delta_allowance
        ));
    }
    async decreaseAllowance(
        spender_address: Account | Address, delta_allowance: Allowance
    ): Promise<TransactionResponse> {
        if (typeof spender_address === 'bigint') {
            spender_address = x40(spender_address);
        }
        return this.put.then((c) => c.decreaseAllowance(
            spender_address, delta_allowance
        ));
    }
    async onApproval(
        listener: OnApproval, { once } = { once: false }
    ) {
        const on_approval = (
            owner: string, spender: string, value: Amount, ev: TxEvent
        ) => {
            listener(BigInt(owner), BigInt(spender), value, ev);
        };
        if (once) {
            await this.get.then((c) => c.once('Approval', on_approval));
        } else {
            await this.get.then((c) => c.on('Approval', on_approval));
        }
    }
    async offApproval(
        listener: OnApproval
    ) {
        await this.get.then((c) => c.off('Approval', listener))
    }
    async onTransfer(
        listener: OnTransfer, { once } = { once: false }
    ) {
        const on_transfer = (
            from: string, to: string, amount: Amount, ev: TxEvent
        ) => {
            if (this._account.match(new RegExp(from, 'i')) ||
                this._account.match(new RegExp(to, 'i'))
            ) {
                listener(BigInt(from), BigInt(to), amount, ev);
            }
        };
        if (once) {
            await this.get.then((c) => c.once('Transfer', on_transfer));
        } else {
            await this.get.then((c) => c.on('Transfer', on_transfer));
        }
    }
    async offTransfer(
        listener: OnTransfer
    ) {
        await this.get.then((c) => c.off('Transfer', listener));
    }
    get account(): Account {
        return BigInt(this._account);
    }
    get address(): Promise<Address> {
        return this.get.then((c) => c.getAddress() as Promise<Address>);
    }
    get balance(): Promise<Balance> {
        return this.get.then((c) => c.balanceOf(this._account));
    }
    get supply(): Promise<Supply> {
        return this.get.then((c) => c.totalSupply());
    }
    get decimals(): Promise<Decimals> {
        return this.get.then((c) => c.decimals());
    }
    abstract get put(): Promise<Contract>;
    abstract get get(): Promise<Contract>;
    private readonly _account: Address;
}
export default ERC20Wallet;
