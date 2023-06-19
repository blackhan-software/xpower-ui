/* eslint @typescript-eslint/no-explicit-any: [off] */
import { BigNumberish, BlockTag, Provider, SigningKey, TransactionRequest, TransactionResponse, Wallet } from 'ethers';

export class OtfWallet extends Wallet {
    constructor(
        key: string | SigningKey, provider: Provider | undefined
    ) {
        super(key, provider);
    }
    connect(
        provider: Provider
    ) {
        return new OtfWallet(this.privateKey, provider);
    }
    async sendTransaction(
        tx: TransactionRequest, n = 3 // max. attempts
    ): Promise<
        TransactionResponse
    > {
        if (typeof tx.nonce !== 'number') {
            tx = { ...tx, nonce: await this.getTxCount('pending') };
        } else {
            this.setTxCount(tx.nonce);
        }
        try {
            return await super.sendTransaction(tx);
        } catch (ex: any) {
            const used = ex?.message?.match(/nonce has already been used/i);
            if (used && n > 0) {
                return this.sendTransaction({ ...tx, nonce: null }, n - 1);
            }
            // reset nonce back to old:
            this.setTxCount(tx.nonce!);
            throw ex;
        }
    }
    private async getTxCount(
        tag?: BlockTag
    ) {
        if (this.provider === null) {
            return null;
        }
        if (tag === 'pending') {
            if (this._initial === undefined) {
                this._initial = this.provider.getTransactionCount(
                    this.address, 'pending'
                );
            }
            return this._initial.then((i) => i + this._counter++);
        }
        return this.provider.getTransactionCount(
            this.address, tag
        );
    }
    private setTxCount(
        nonce: BigNumberish | Promise<BigNumberish>
    ) {
        this._initial = Promise.resolve(nonce).then((n) => Number(n));
        this._counter = 0;
    }
    _initial: Promise<number> | undefined;
    _counter = 0;
}
export default OtfWallet;
