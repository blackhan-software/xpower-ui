import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, Contract, Event } from 'ethers';
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
export type OnURI = (
    value: string,
    id: BigNumber,
    ev: Event
) => void;
export enum Kind {
    UNIT = 0,
    KILO = 3,
    MEGA = 6,
    GIGA = 9,
    TERA = 12,
    PETA = 15,
    EXA = 18,
    ZETTA = 21,
    YOTTA = 24,
}
export function* Kinds() {
    for (const k in Kind) {
        if (isNaN(Number(k))) {
            continue;
        }
        yield Number(k) as Kind;
    }
}
export type Meta = {
    name: string,
    description: string,
    image: string
};
export class XPowerNft {
    public static kinds(
        ids: BigNumber[], year: BigNumber
    ) {
        return ids.map((id) => this.kind(id, year));
    }
    public static kind(
        id: BigNumber, year: BigNumber
    ) {
        return id.sub(year.mul(100)).toNumber() as Kind;
    }
    public static meta(
        contract: Contract
    ) {
        return async (id: BigNumber) => {
            let meta = XPowerNft._meta[id.toString()];
            if (typeof meta === 'undefined') {
                const nft_uri = await contract.uri(id);
                const uri = nft_uri.replace(/{id}/g, id);
                meta = await fetch(uri).then((res) => res.json());
                XPowerNft._meta[id.toString()] = meta;
            }
            return meta;
        };
    }
    public static year(
        contract: Contract
    ) {
        return async (delta_years: BigNumber | number) => {
            const nft_year = await contract.year();
            return nft_year.add(delta_years);
        }
    }
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
    private _abi: typeof XPOWER_NFT_ABI;
    private _address: string;
    private _contract: Contract | undefined;
    private static _meta: Record<string, Meta> = {};
}
export default XPowerNft;
