import { BigNumber, Contract, Transaction, Event } from 'ethers';
import { Address, Amount, Balance, Supply, Year } from '../redux/types';
import { Nft, NftCoreId, NftIssue, NftLevel } from '../redux/types';
import { Meta, XPowerNftFactory, XPowerNftMockFactory } from '../xpower';
import { OnTransferBatch as on_transfer_batch } from '../xpower';
import { OnTransferSingle as on_transfer_single } from '../xpower';
import { x40 } from '../functions';

export type OnTransferBatch = (
    operator: Address,
    from: Address,
    to: Address,
    ids: NftCoreId[],
    values: Amount[],
    ev: Event
) => void;
export type OnTransferSingle = (
    operator: Address,
    from: Address,
    to: Address,
    id: NftCoreId,
    value: Amount,
    ev: Event
) => void;

export class NftWallet {
    constructor(
        address: Address | string
    ) {
        if (typeof address === 'bigint') {
            address = x40(address);
        }
        if (!address.match(/^0x/)) {
            throw new Error('address prefix is not 0x')
        }
        if (address.length !== 42) {
            throw new Error('address length is not 42')
        }
        this._address = address;
    }
    async balance(
        id: NftCoreId
    ): Promise<Balance> {
        const balance: BigNumber = await this.contract.balanceOf(
            this._address, id
        );
        return balance.toBigInt();
    }
    async balances({ issues, levels }: {
        issues: NftIssue[], levels: NftLevel[],
    }): Promise<Balance[]> {
        const ids = Nft.coreIds({ issues, levels });
        const addresses = ids.map(() => this._address);
        const balances: BigNumber[] = await this.contract.balanceOfBatch(
            addresses, ids
        );
        return balances.map((b) => b.toBigInt());
    }
    async idBy(
        year: Year, level: NftLevel
    ): Promise<NftCoreId> {
        const id: BigNumber = await this.contract.idBy(year, level);
        return id.toString() as NftCoreId;
    }
    async meta(
        id: NftCoreId
    ): Promise<Meta> {
        let meta = this._meta[id.toString()];
        if (typeof meta === 'undefined') {
            const nft_uri = await this.contract.uri(id);
            const uri = nft_uri.replace(/{id}/g, id);
            meta = await fetch(uri).then((res) => res.json());
            this._meta[id.toString()] = meta;
        }
        return meta;
    }
    mintBatch(
        levels: NftLevel[], amounts: Amount[]
    ): Promise<Transaction> {
        return this.contract.mintBatch(levels, amounts);
    }
    onTransferBatch(
        handler: OnTransferBatch, { once } = { once: false }
    ) {
        const on_transfer: on_transfer_batch = (
            op, from, to, ids, values, ev
        ) => {
            if (this._address.match(new RegExp(from, 'i')) ||
                this._address.match(new RegExp(to, 'i'))
            ) {
                handler(
                    BigInt(op), BigInt(from), BigInt(to),
                    ids.map((id) => id.toString() as NftCoreId),
                    values.map((value) => value.toBigInt()), ev
                );
            }
        };
        if (once) {
            this.contract.once('TransferBatch', on_transfer);
        } else {
            this.contract.on('TransferBatch', on_transfer);
        }
    }
    onTransferSingle(
        handler: OnTransferSingle, { once } = { once: false }
    ) {
        const on_transfer: on_transfer_single = (
            op, from, to, id, value, ev
        ) => {
            if (this._address.match(new RegExp(from, 'i')) ||
                this._address.match(new RegExp(to, 'i'))
            ) {
                handler(
                    BigInt(op), BigInt(from), BigInt(to),
                    id.toString() as NftCoreId,
                    value.toBigInt(), ev
                );
            }
        };
        if (once) {
            this.contract.once('TransferSingle', on_transfer);
        } else {
            this.contract.on('TransferSingle', on_transfer);
        }
    }
    safeTransfer(
        to_address: Address | string, id: NftCoreId, amount: Amount
    ): Promise<Transaction> {
        if (typeof to_address === 'bigint') {
            to_address = x40(to_address);
        }
        return this.contract.safeTransferFrom(
            this._address, to_address, id, amount, []
        );
    }
    async totalSupply(
        id: NftCoreId
    ): Promise<Supply> {
        const supply: BigNumber = await this.contract.totalSupply(id);
        return supply.toBigInt();
    }
    totalSupplies({ issues, levels }: {
        issues: NftIssue[],
        levels: NftLevel[]
    }): Promise<Supply>[] {
        return Array.from(nftSupplies(
            this.contract, { issues, levels }
        ));
    }
    async year(
        delta_years: number
    ): Promise<Year> {
        const year: BigNumber = await this.contract.year();
        return year.sub(delta_years).toBigInt();
    }
    get address(): Address {
        if (typeof this._address === 'string') {
            return BigInt(this._address);
        }
        return this._address;
    }
    get contract(): Contract {
        if (this._contract === undefined) {
            this._contract = XPowerNftFactory();
        }
        return this._contract;
    }
    protected _address: string;
    protected _contract: Contract | undefined;
    protected _meta: Record<string, Meta> = {};
}
export class NftWalletMock extends NftWallet {
    constructor(
        address: Address | string = 0n
    ) {
        super(address);
    }
    get contract(): Contract {
        if (this._contract === undefined) {
            this._contract = XPowerNftMockFactory();
        }
        return this._contract;
    }
}
function* nftSupplies(
    nft: Contract, { issues, levels }: {
        issues: NftIssue[], levels: NftLevel[]
    }
): Generator<Promise<Supply>> {
    const ids = Nft.coreIds({ issues, levels });
    for (const id of ids) {
        const supply = nft.totalSupply(id).then(
            (s: BigNumber) => s.toBigInt()
        );
        yield supply as Promise<Supply>;
    }
}
export default NftWallet;
