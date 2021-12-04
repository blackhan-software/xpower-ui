import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, Contract, Event } from 'ethers';
import { Blockchain } from '../blockchain';

import XPOWER_ABI from '../xpower-abi.json';

export type OnInit = (
    block_hash: string, timestamp: BigNumber, ev: Event
) => void;
export type OnTransfer = (
    from: string, to: string, amount: BigNumber, ev: Event
) => void;
export type OnApproval = (
    owner: string, spender: string, value: BigNumber, ev: Event
) => void;

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
                Blockchain.provider
            );
        }
        const signer = provider.getSigner();
        return this.contract.connect(signer);
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
export default XPower;
