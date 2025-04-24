import { Contract, TransactionResponse } from 'ethers';
import { x40 } from '../functions';
import { Account, Address, Amount, Balance, Nft, NftFullId, NftIssue, NftLevel, NftRealId, Supply } from '../redux/types';
import { TxEvent, Version } from '../types';

export type OnTransferBatch = (
    operator: Account,
    from: Account,
    to: Account,
    ids: NftFullId[],
    values: Amount[],
    ev: TxEvent
) => void;
export type OnTransferSingle = (
    operator: Account,
    from: Account,
    to: Account,
    id: NftFullId,
    value: Amount,
    ev: TxEvent
) => void;
export type OnApprovalForAll = (
    account: Account,
    operator: Account,
    approved: boolean,
    ev: TxEvent
) => void;

export type Meta = {
    name: string,
    description: string,
    image: string
};
export abstract class ERC1155Wallet {
    constructor(
        account: Account | Address, version: Version
    ) {
        if (typeof account === 'bigint') {
            this._account = x40(account);
        } else {
            this._account = account;
        }
        if (!this._account.match(/^0x/)) {
            throw new Error('address prefix is not 0x')
        }
        if (this._account.length !== 42) {
            throw new Error('address length is not 42')
        }
        this._version = version;
    }
    async balance(
        full_id: NftFullId
    ): Promise<Balance> {
        const real_id = Nft.realId(full_id, {
            version: this._version
        });
        return this.get.then(
            (c) => c.balanceOf(this._account, real_id)
        );
    }
    async balances({ issues, levels }: {
        issues: NftIssue[], levels: NftLevel[]
    }): Promise<Balance[]> {
        const full_ids = Nft.fullIds({
            issues, levels
        });
        const real_ids = Nft.realIds(full_ids, {
            version: this._version
        });
        const addresses = full_ids.map(() => this._account);
        const balances: Balance[] = await this.get.then(
            (c) => c.balanceOfBatch(addresses, real_ids)
        );
        return balances;
    }
    async isApprovedForAll(
        operator: Account | Address
    ): Promise<boolean> {
        if (typeof operator === 'bigint') {
            operator = x40(operator);
        }
        return this.get.then((c) => c.isApprovedForAll(
            this._account, operator
        ));
    }
    async setApprovalForAll(
        operator: Account | Address, approved: boolean
    ): Promise<TransactionResponse> {
        if (typeof operator === 'bigint') {
            operator = x40(operator);
        }
        return this.put.then((c) => c.setApprovalForAll(
            operator, approved
        ));
    }
    async onApprovalForAll(
        listener: OnApprovalForAll, { once } = { once: false }
    ) {
        const on_approval = (
            account: string,
            operator: string,
            approved: boolean,
            ev: TxEvent
        ) => {
            if (this._account.match(new RegExp(account, 'i'))) {
                listener(BigInt(account), BigInt(operator), approved, ev);
            }
        };
        if (once) {
            await this.get.then((c) => c.once('ApprovalForAll', on_approval));
        } else {
            await this.get.then((c) => c.on('ApprovalForAll', on_approval));
        }
    }
    async offApprovalForAll(
        listener: OnApprovalForAll
    ) {
        await this.get.then((c) => c.off('ApprovalForAll', listener));
    }
    async safeTransfer(
        to: Account | Address, full_id: NftFullId, amount: Amount
    ): Promise<TransactionResponse> {
        if (typeof to === 'bigint') {
            to = x40(to);
        }
        const real_id = Nft.realId(full_id, {
            version: this._version
        });
        return this.put.then((c) => c.safeTransferFrom(
            this._account, to, real_id, amount, new Uint8Array()
        ));
    }
    async onTransferSingle(
        listener: OnTransferSingle, { once } = { once: false }
    ) {
        const on_transfer = (
            operator: string,
            from: string,
            to: string,
            id: Balance,
            value: Balance,
            ev: TxEvent
        ) => {
            if (this._account.match(new RegExp(from, 'i')) ||
                this._account.match(new RegExp(to, 'i'))
            ) {
                const full_id = Nft.fullIdOf({
                    real_id: id.toString() as NftRealId
                });
                listener(
                    BigInt(operator), BigInt(from), BigInt(to),
                    full_id, value, ev
                );
            }
        };
        if (once) {
            await this.get.then((c) => c.once('TransferSingle', on_transfer));
        } else {
            await this.get.then((c) => c.on('TransferSingle', on_transfer));
        }
    }
    async offTransferSingle(
        listener: OnTransferSingle
    ) {
        await this.get.then((c) => c.off('TransferSingle', listener));
    }
    async safeBatchTransfer(
        to: Account | Address, full_ids: NftFullId[], amounts: Amount[]
    ): Promise<TransactionResponse> {
        if (typeof to === 'bigint') {
            to = x40(to);
        }
        const real_ids = Nft.realIds(full_ids, {
            version: this._version
        });
        return this.put.then((c) => c.safeBatchTransferFrom(
            this._account, to, real_ids, amounts, new Uint8Array()
        ));
    }
    async onTransferBatch(
        listener: OnTransferBatch, { once } = { once: false }
    ) {
        const on_transfer = (
            operator: string,
            from: string,
            to: string,
            ids: Balance[],
            values: Balance[],
            ev: TxEvent
        ) => {
            if (this._account.match(new RegExp(from, 'i')) ||
                this._account.match(new RegExp(to, 'i'))
            ) {
                const full_ids = ids
                    .map((id) => id.toString() as NftRealId)
                    .map((id) => Nft.fullIdOf({ real_id: id }));
                listener(
                    BigInt(operator), BigInt(from), BigInt(to), full_ids,
                    values.map((value) => value), ev
                );
            }
        };
        if (once) {
            await this.get.then((c) => c.once('TransferBatch', on_transfer));
        } else {
            await this.get.then((c) => c.on('TransferBatch', on_transfer));
        }
    }
    async offTransferBatch(
        listener: OnTransferBatch
    ) {
        await this.get.then((c) => c.off('TransferBatch', listener));
    }
    async uri(
        full_id: NftFullId | Promise<NftFullId>
    ): Promise<string> {
        const real_id = Nft.realId(await full_id, {
            version: this._version
        });
        return this.get.then(
            async (c) => c.uri(real_id)
        );
    }
    async meta(
        full_id: NftFullId | Promise<NftFullId>
    ): Promise<Meta> {
        let meta = this._meta[full_id.toString()];
        if (typeof meta === 'undefined') {
            const real_id = Nft.realId(await full_id, {
                version: this._version
            });
            const nft_uri = await this.uri(full_id);
            const uri = nft_uri.replace(/{id}/g, real_id);
            meta = await fetch(uri).then((res) => res.json()).catch((e) => {
                console.error(e);
                return {
                    name: full_id.toString(),
                    description: 'N/A',
                    image: ''
                };
            });
            this._meta[full_id.toString()] = meta;
        }
        return meta;
    }
    async totalSupply(
        full_id: NftFullId | Promise<NftFullId>
    ): Promise<Supply> {
        const real_id = Nft.realId(await full_id, {
            version: this._version
        });
        const supply: Supply = await this.get.then(
            async (c) => c['totalSupply(uint256)'](real_id)
        );
        return supply;
    }
    async totalSupplies({ issues, levels }: {
        issues: NftIssue[], levels: NftLevel[]
    }): Promise<Supply[]> {
        return Promise.all(Array.from(totalSupplies(
            this.get, { issues, levels }, this._version
        )));
    }
    get account(): Account {
        return BigInt(this._account);
    }
    get address(): Promise<Address> {
        return this.get.then(
            (c) => c.getAddress() as Promise<Address>
        );
    }
    abstract get put(): Promise<Contract>;
    abstract get get(): Promise<Contract>;
    private readonly _account: Address;
    private readonly _meta: Record<string, Meta> = {};
    private readonly _version: Version;
}
function* totalSupplies(
    nft: Promise<Contract>, {
        issues, levels
    }: {
        issues: NftIssue[],
        levels: NftLevel[]
    },
    version: Version
): Generator<Promise<Supply>> {
    const full_ids = Nft.fullIds({
        issues, levels
    });
    for (const full_id of full_ids) {
        const real_id = Nft.realId(full_id, { version });
        yield nft.then((c) => c['totalSupply(uint256)'](real_id));
    }
}
export default ERC1155Wallet;
