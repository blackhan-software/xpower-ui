import { BigNumber, Contract, Event, Signer } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { Blockchain } from '../blockchain';

import XPOWER_NFT_ABI from '../xpower-nft-abi.json';

export type OnTransferSingle = (
    operator: string,
    from: string,
    to: string,
    id: BigNumber,
    value: BigNumber,
    ev: Event
) => void;
export type OnTransferBatch = (
    operator: string,
    from: string,
    to: string,
    ids: BigNumber[],
    values: BigNumber[],
    ev: Event
) => void;
export type OnApprovalForAll = (
    address: string,
    operator: string,
    approved: boolean,
    ev: Event
) => void;

export class XPowerNft {
    public constructor(
        address: string, abi = XPOWER_NFT_ABI
    ) {
        if (!address) {
            throw new Error('missing XPowerNft contract address');
        }
        this._address = address;
        if (!abi) {
            throw new Error('missing XPowerNft ABI');
        }
        this._abi = abi;
    }
    public connect(pos?: Web3Provider | Signer): Contract {
        if (pos == undefined) {
            pos = new Web3Provider(Blockchain.provider);
            return this.contract.connect(pos.getSigner());
        }
        return this.contract.connect(pos);
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
    private _abi: typeof XPOWER_NFT_ABI;
    private _address: string;
    private _contract: Contract | undefined;
}
export type Meta = {
    name: string,
    description: string,
    image: string
};
export default XPowerNft;
