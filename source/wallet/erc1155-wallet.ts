import { BigNumber, Contract, Event, Transaction } from 'ethers';
import { x40 } from '../functions';
import { Address, Amount, Balance, Nft, NftFullId, NftIssue, NftLevel, NftRealId, NftToken, Supply, Token } from '../redux/types';

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

export type Meta = {
    name: string,
    description: string,
    image: string
};
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
            .then((c) => c.balanceOf(this._address, Nft.realId(id)));
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
            .then((c) => c.balanceOfBatch(addresses, Nft.realIds(ids)));
        return balances.map((b) => b.toBigInt());
    }
    async isApprovedForAll(
        operator: Address | string
    ): Promise<boolean> {
        if (typeof operator === 'bigint') {
            operator = x40(operator);
        }
        return this.contract.then((c) => c.isApprovedForAll(
            this._address, operator
        ));
    }
    async setApprovalForAll(
        operator: Address | string, approved: boolean
    ): Promise<Transaction> {
        if (typeof operator === 'bigint') {
            operator = x40(operator);
        }
        return this.contract.then((c) => c.setApprovalForAll(
            operator, approved
        ));
    }
    onApprovalForAll(
        listener: OnApprovalForAll, { once } = { once: false }
    ) {
        const on_approval = (
            account: string,
            operator: string,
            approved: boolean,
            ev: Event
        ) => {
            if (this._address.match(new RegExp(account, 'i'))) {
                listener(BigInt(account), BigInt(operator), approved, ev);
            }
        };
        if (once) {
            this.contract.then((c) => c.once('ApprovalForAll', on_approval));
        } else {
            this.contract.then((c) => c.on('ApprovalForAll', on_approval));
        }
    }
    async safeTransfer(
        to: Address | string, id: NftFullId, amount: Amount
    ): Promise<Transaction> {
        if (typeof to === 'bigint') {
            to = x40(to);
        }
        return this.contract.then((c) => c.safeTransferFrom(
            this._address, to, Nft.realId(id), amount, []
        ));
    }
    onTransferSingle(
        listener: OnTransferSingle, { once } = { once: false }
    ) {
        const on_transfer = (
            operator: string,
            from: string,
            to: string,
            id: BigNumber,
            value: BigNumber,
            ev: Event
        ) => {
            if (this._address.match(new RegExp(from, 'i')) ||
                this._address.match(new RegExp(to, 'i'))
            ) {
                const full_id = Nft.fullIdOf({
                    real_id: id.toString() as NftRealId,
                    token: this._nftToken
                });
                listener(
                    BigInt(operator), BigInt(from), BigInt(to),
                    full_id, value.toBigInt(), ev
                );
            }
        };
        if (once) {
            this.contract.then((c) => c.once('TransferSingle', on_transfer));
        } else {
            this.contract.then((c) => c.on('TransferSingle', on_transfer));
        }
    }
    async safeBatchTransfer(
        to: Address | string, ids: NftFullId[], amounts: Amount[]
    ): Promise<Transaction> {
        if (typeof to === 'bigint') {
            to = x40(to);
        }
        return this.contract.then((c) => c.safeBatchTransferFrom(
            this._address, to, Nft.realIds(ids), amounts, []
        ));
    }
    onTransferBatch(
        listener: OnTransferBatch, { once } = { once: false }
    ) {
        const on_transfer = (
            operator: string,
            from: string,
            to: string,
            ids: BigNumber[],
            values: BigNumber[],
            ev: Event
        ) => {
            if (this._address.match(new RegExp(from, 'i')) ||
                this._address.match(new RegExp(to, 'i'))
            ) {
                const full_ids = ids
                    .map((id) => id.toString() as NftRealId)
                    .map((id) => Nft.fullIdOf({
                        real_id: id, token: this._nftToken
                    }));
                listener(
                    BigInt(operator), BigInt(from), BigInt(to), full_ids,
                    values.map((value) => value.toBigInt()), ev
                );
            }
        };
        if (once) {
            this.contract.then((c) => c.once('TransferBatch', on_transfer));
        } else {
            this.contract.then((c) => c.on('TransferBatch', on_transfer));
        }
    }
    async uri(
        id: NftFullId | Promise<NftFullId>
    ): Promise<string> {
        return this.contract.then(
            async (c) => c.uri(Nft.realId(await id))
        );
    }
    async meta(
        id: NftFullId | Promise<NftFullId>
    ): Promise<Meta> {
        let meta = this._meta[id.toString()];
        if (typeof meta === 'undefined') {
            const nft_uri = await this.uri(id);
            const uri = nft_uri.replace(/{id}/g, Nft.realId(await id));
            meta = await fetch(uri).then((res) => res.json());
            this._meta[id.toString()] = meta;
        }
        return meta;
    }
    async totalSupply(
        id: NftFullId | Promise<NftFullId>
    ): Promise<Supply> {
        const supply: BigNumber = await this.contract.then(
            async (c) => c.totalSupply(Nft.realId(await id))
        );
        return supply.toBigInt();
    }
    async totalSupplies({ issues, levels, token }: {
        issues: NftIssue[], levels: NftLevel[], token: NftToken
    }): Promise<Supply[]> {
        return Promise.all(Array.from(totalSupplies(
            this.contract, { issues, levels, token }
        )));
    }
    get address(): Address {
        return BigInt(this._address);
    }
    get nftToken(): NftToken {
        return this._nftToken;
    }
    get token(): Token {
        return this._token;
    }
    abstract get contract(): Promise<Contract>;
    private readonly _address: string;
    private readonly _meta: Record<string, Meta> = {};
    private readonly _nftToken: NftToken;
    private readonly _token: Token;
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
            .then((c) => c.totalSupply(Nft.realId(id)))
            .then((s: BigNumber) => s.toBigInt());
        yield supply as Promise<Supply>;
    }
}
export default ERC1155Wallet;
