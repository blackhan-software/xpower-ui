import { BigNumber, Contract, Event, Transaction } from 'ethers';
import { OnApprovalForAll as on_approval_for_all, OnTransferBatch as on_transfer_batch, OnTransferSingle as on_transfer_single } from '../contract';
import { Address, Amount, Balance, Nft, NftFullId, NftIssue, NftLevel, NftRealId, NftToken, Supply, Token } from '../redux/types';

import { Meta } from '../contract';
import { x40 } from '../functions';

export type OnTransferBatch = (
    operator: Address,
    from: Address,
    to: Address,
    ids: NftFullId[],
    values: Amount[],
    ev: Event
) => void;
export type OnTransferSingle = (
    operator: Address,
    from: Address,
    to: Address,
    id: NftFullId,
    value: Amount,
    ev: Event
) => void;
export type OnApprovalForAll = (
    account: Address,
    operator: Address,
    approved: boolean,
    ev: Event
) => void;

export abstract class ERC1155Wallet {
    constructor(
        address: Address | string, token: Token
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
        this._nftToken = Nft.token(token);
        this._token = token;
    }
    async balance(
        id: NftFullId
    ): Promise<Balance> {
        const balance: BigNumber = await this.contract
            .then((c) => c?.balanceOf(this._address, Nft.realId(id)));
        console.debug(
            '[balance-of]', id, '=>', Nft.realId(id), '=', balance.toBigInt()
        );
        return balance.toBigInt();
    }
    async balances({ issues, levels, token }: {
        issues: NftIssue[], levels: NftLevel[], token: NftToken
    }): Promise<Balance[]> {
        const ids = Nft.fullIds({ issues, levels, token });
        const addresses = ids.map(() => this._address);
        const balances: BigNumber[] = await this.contract
            .then((c) => c?.balanceOfBatch(addresses, Nft.realIds(ids)));
        return balances.map((b) => b.toBigInt());
    }
    async isApprovedForAll(
        operator: Address | string
    ): Promise<boolean> {
        if (typeof operator === 'bigint') {
            operator = x40(operator);
        }
        return this.contract.then((c) => c?.isApprovedForAll(
            this._address, operator
        ));
    }
    async setApprovalForAll(
        operator: Address | string, approved: boolean
    ): Promise<Transaction> {
        if (typeof operator === 'bigint') {
            operator = x40(operator);
        }
        return this.contract.then((c) => c?.setApprovalForAll(
            operator, approved
        ));
    }
    onApprovalForAll(
        handler: OnApprovalForAll, { once } = { once: false }
    ) {
        const on_approval: on_approval_for_all = (
            account, op, flag, ev
        ) => {
            if (this._address.match(new RegExp(account, 'i'))) {
                handler(
                    BigInt(account), BigInt(op), flag, ev
                );
            }
        };
        if (once) {
            this.contract.then((c) => c?.once('ApprovalForAll', on_approval));
        } else {
            this.contract.then((c) => c?.on('ApprovalForAll', on_approval));
        }
    }
    safeTransfer(
        to: Address | string, id: NftFullId, amount: Amount
    ): Promise<Transaction> {
        if (typeof to === 'bigint') {
            to = x40(to);
        }
        return this.contract.then((c) => c?.safeTransferFrom(
            this._address, to, Nft.realId(id), amount, []
        ));
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
                const full_id = Nft.fullIdOf({
                    real_id: id.toString() as NftRealId,
                    token: this._nftToken
                });
                handler(
                    BigInt(op), BigInt(from), BigInt(to),
                    full_id, value.toBigInt(), ev
                );
            }
        };
        if (once) {
            this.contract.then((c) => c?.once('TransferSingle', on_transfer));
        } else {
            this.contract.then((c) => c?.on('TransferSingle', on_transfer));
        }
    }
    safeBatchTransfer(
        to: Address | string, ids: NftFullId[], amounts: Amount[]
    ): Promise<Transaction> {
        if (typeof to === 'bigint') {
            to = x40(to);
        }
        return this.contract.then((c) => c?.safeBatchTransferFrom(
            this._address, to, Nft.realIds(ids), amounts, []
        ));
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
                const full_ids = ids
                    .map((id) => id.toString() as NftRealId)
                    .map((id) => Nft.fullIdOf({
                        real_id: id, token: this._nftToken
                    }));
                handler(
                    BigInt(op), BigInt(from), BigInt(to), full_ids,
                    values.map((value) => value.toBigInt()), ev
                );
            }
        };
        if (once) {
            this.contract.then((c) => c?.once('TransferBatch', on_transfer));
        } else {
            this.contract.then((c) => c?.on('TransferBatch', on_transfer));
        }
    }
    async meta(
        id: NftFullId
    ): Promise<Meta> {
        let meta = this._meta[id.toString()];
        if (typeof meta === 'undefined') {
            const nft_uri = await this.contract.then((c) => c?.uri(Nft.realId(id)));
            const uri = nft_uri.replace(/{id}/g, Nft.realId(id));
            meta = await fetch(uri).then((res) => res.json());
            this._meta[id.toString()] = meta;
        }
        return meta;
    }
    async totalSupply(
        id: NftFullId
    ): Promise<Supply> {
        const supply: BigNumber = await this.contract
            .then((c) => c?.totalSupply(Nft.realId(id)));
        return supply.toBigInt();
    }
    totalSupplies({ issues, levels, token }: {
        issues: NftIssue[], levels: NftLevel[], token: NftToken
    }): Promise<Supply>[] {
        return Array.from(totalSupplies(
            this.contract, { issues, levels, token }
        ));
    }
    get address(): Address {
        return BigInt(this._address);
    }
    abstract get contract(): Promise<Contract>;
    protected readonly _address: string;
    protected _contract: Contract | undefined;
    protected _meta: Record<string, Meta> = {};
    protected readonly _nftToken: NftToken;
    protected readonly _token: Token;
}
function* totalSupplies(
    nft: Promise<Contract>, { issues, levels, token }: {
        issues: NftIssue[], levels: NftLevel[], token: NftToken
    }
): Generator<Promise<Supply>> {
    const full_ids = Nft.fullIds({
        issues, levels, token
    });
    for (const id of full_ids) {
        const supply = nft
            .then((c) => c?.totalSupply(Nft.realId(id)))
            .then((s: BigNumber) => s.toBigInt());
        yield supply as Promise<Supply>;
    }
}
export default ERC1155Wallet;
