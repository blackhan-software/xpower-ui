import { Contract, Transaction } from 'ethers';
import { x40 } from '../functions';
import { Account, Address, Amount, Balance, Nft, NftFullId, NftIssue, NftLevel, NftRealId, NftToken, Supply, Token } from '../redux/types';
import { TxEvent } from '../types';

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
        account: Account | Address, token: Token
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
        this._nftToken = Nft.token(token);
        this._token = token;
    }
    async balance(
        id: NftFullId
    ): Promise<Balance> {
        return this.wsc.then(
            (c) => c.balanceOf(this._account, Nft.realId(id))
        );
    }
    async balances({ issues, levels, token }: {
        issues: NftIssue[], levels: NftLevel[], token: NftToken
    }): Promise<Balance[]> {
        const ids = Nft.fullIds({ issues, levels, token });
        const addresses = ids.map(() => this._account);
        const balances: Balance[] = await this.wsc.then(
            (c) => c.balanceOfBatch(addresses, Nft.realIds(ids))
        );
        return balances;
    }
    async isApprovedForAll(
        operator: Account | Address
    ): Promise<boolean> {
        if (typeof operator === 'bigint') {
            operator = x40(operator);
        }
        return this.wsc.then((c) => c.isApprovedForAll(
            this._account, operator
        ));
    }
    async setApprovalForAll(
        operator: Account | Address, approved: boolean
    ): Promise<Transaction> {
        if (typeof operator === 'bigint') {
            operator = x40(operator);
        }
        return this.mmc.then((c) => c.setApprovalForAll(
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
            ev: TxEvent
        ) => {
            if (this._account.match(new RegExp(account, 'i'))) {
                listener(BigInt(account), BigInt(operator), approved, ev);
            }
        };
        if (once) {
            this.wsc.then((c) => c.once('ApprovalForAll', on_approval));
        } else {
            this.wsc.then((c) => c.on('ApprovalForAll', on_approval));
        }
    }
    async safeTransfer(
        to: Account | Address, id: NftFullId, amount: Amount
    ): Promise<Transaction> {
        if (typeof to === 'bigint') {
            to = x40(to);
        }
        return this.mmc.then((c) => c.safeTransferFrom(
            this._account, to, Nft.realId(id), amount, []
        ));
    }
    onTransferSingle(
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
                    real_id: id.toString() as NftRealId,
                    token: this._nftToken
                });
                listener(
                    BigInt(operator), BigInt(from), BigInt(to),
                    full_id, value, ev
                );
            }
        };
        if (once) {
            this.wsc.then((c) => c.once('TransferSingle', on_transfer));
        } else {
            this.wsc.then((c) => c.on('TransferSingle', on_transfer));
        }
    }
    async safeBatchTransfer(
        to: Account | Address, ids: NftFullId[], amounts: Amount[]
    ): Promise<Transaction> {
        if (typeof to === 'bigint') {
            to = x40(to);
        }
        return this.mmc.then((c) => c.safeBatchTransferFrom(
            this._account, to, Nft.realIds(ids), amounts, []
        ));
    }
    onTransferBatch(
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
                    .map((id) => Nft.fullIdOf({
                        real_id: id, token: this._nftToken
                    }));
                listener(
                    BigInt(operator), BigInt(from), BigInt(to), full_ids,
                    values.map((value) => value), ev
                );
            }
        };
        if (once) {
            this.wsc.then((c) => c.once('TransferBatch', on_transfer));
        } else {
            this.wsc.then((c) => c.on('TransferBatch', on_transfer));
        }
    }
    async uri(
        id: NftFullId | Promise<NftFullId>
    ): Promise<string> {
        return this.wsc.then(
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
        const supply: Supply = await this.wsc.then(
            async (c) => c.totalSupply(Nft.realId(await id))
        );
        return supply;
    }
    async totalSupplies({ issues, levels, token }: {
        issues: NftIssue[], levels: NftLevel[], token: NftToken
    }): Promise<Supply[]> {
        return Promise.all(Array.from(totalSupplies(
            this.wsc, { issues, levels, token }
        )));
    }
    get account(): Account {
        return BigInt(this._account);
    }
    get address(): Promise<Address> {
        return this.mmc.then((c) => c.getAddress() as Promise<Address>);
    }
    get nftToken(): NftToken {
        return this._nftToken;
    }
    get token(): Token {
        return this._token;
    }
    abstract get mmc(): Promise<Contract>;
    abstract get wsc(): Promise<Contract>;
    private readonly _account: Address;
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
        yield nft.then((c) => c.totalSupply(Nft.realId(id)));
    }
}
export default ERC1155Wallet;
