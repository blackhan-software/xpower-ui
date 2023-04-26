import { BigNumberish, BlockTag, Provider, SigningKey, TransactionRequest, Wallet } from 'ethers';

export class OtfWallet extends Wallet {
    constructor(
        key: string | SigningKey, provider: Provider
    ) {
        super(key, provider);
    }
    connect(
        provider: Provider
    ) {
        return new OtfWallet(this.privateKey, provider);
    }
    async sendTransaction(
        tx: TransactionRequest
    ) {
        if (typeof tx.nonce !== 'number') {
            tx = { ...tx, nonce: await this.getTxCount('pending') };
            this.incTxCount();
        } else {
            this.setTxCount(tx.nonce);
            this._counter++;
        }
        return super.sendTransaction(tx);
    }
    private async getTxCount(
        tag?: BlockTag
    ) {
        if (tag === 'pending') {
            if (this._initial === undefined) {
                this._initial = this.provider!.getTransactionCount(
                    this.address, 'pending'
                );
            }
            return this._initial.then((i) => (i + this._counter));
        }
        return this.provider!.getTransactionCount(this.address, tag);
    }
    private setTxCount(
        tx_count: BigNumberish | Promise<BigNumberish>
    ) {
        this._initial = Promise.resolve(tx_count).then(
            (nonce) => Number(nonce)
        );
        this._counter = 0;
    }
    private incTxCount(
        delta?: number
    ) {
        this._counter += typeof delta === 'number' ? delta : 1;
    }
    _initial: Promise<number> | undefined;
    _counter = 0;
}
export default OtfWallet;
