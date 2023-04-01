import { Global } from '../types';
declare const global: Global;

import { Web3Provider } from '@ethersproject/providers';
import { Contract, ContractInterface, Signer } from 'ethers';
import { Blockchain } from '../blockchain';

export class Base {
    public constructor(
        address: string, abi: ContractInterface
    ) {
        if (!address) {
            throw new Error('missing contract address');
        }
        this._address = address;
        if (!abi) {
            throw new Error('missing ABI');
        }
        this._abi = abi;
    }
    public async connect(pos?: Web3Provider | Signer): Promise<Contract> {
        if (pos == undefined) {
            if (this._connected === undefined) {
                if (this._provider === undefined) {
                    this._provider = global.WEB3_PROVIDER = new Web3Provider(
                        await Blockchain.provider
                    );
                }
                //
                // @info: disabled due to potential rate-limiting!
                //
                // if (await Blockchain.isAvalanche()) {
                //     this._provider._pollingInterval = 200; // ms
                // }
                //
                const signer = this._provider.getSigner();
                this._connected = this.contract.connect(signer);
            }
            return this._connected;
        }
        return this.contract.connect(pos);
    }
    protected get contract(): Contract {
        if (this._contract === undefined) {
            this._contract = new Contract(this.address, this.abi);
        }
        return this._contract;
    }
    protected get abi() {
        return this._abi;
    }
    public get address() {
        return this._address;
    }
    private _abi: ContractInterface;
    private _address: string;
    private _contract: Contract | undefined;
    private _connected: Contract | undefined;
    private _provider: Web3Provider | undefined;
}
export default Base;
