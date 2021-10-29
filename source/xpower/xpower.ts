import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, Contract, Event } from 'ethers';
import { Blockchain } from '../blockchain';

import XPOWER_ABI from '../xpower-abi.json';

export class XPower {
    public constructor(
        address: string, abi = XPOWER_ABI
    ) {
        if (!address) {
            throw new Error('missing XPower contract address');
        }
        this._address = address;
        if (!abi) {
            throw new Error('missing XPower ABI');
        }
        this._abi = abi;
    }
    public connect(provider?: Web3Provider): Contract {
        if (provider == undefined) {
            provider = new Web3Provider(
                Blockchain.me.provider
            );
        }
        const signer = provider.getSigner();
        return this.contract.connect(signer);
    }
    public filterEvents(): void {
        const from = '0x0000000000000000000000000000000000000000';
        const to = Blockchain.me.selectedAddress;
        this.contract.filters.Transfer(from, to);
    }
    private get contract(): Contract {
        if (this._contract === undefined) {
            this._contract = new Contract(
                this.address, this.abi
            );
        }
        return this._contract;
    }
    private get abi() {
        return this._abi;
    }
    private get address() {
        return this._address;
    }
    private _abi: typeof XPOWER_ABI;
    private _address: string;
    private _contract: Contract | undefined;
}
export const onTransferBefore = (
    from: string, to: string, amount: BigNumber, ev: Event
): void => {
    console.debug('[on:transfer|before]', ev);
};
export const onTransferAfter = (
    from: string, to: string, amount: BigNumber, ev: Event
): void => {
    console.debug('[on:transfer|after]', ev);
};
export default XPower;
