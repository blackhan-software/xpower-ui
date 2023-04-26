import { Contract, ContractRunner, InterfaceAbi } from 'ethers';
import { MMProvider } from '../blockchain';
import { Address } from '../redux/types';

export class Base {
    public constructor(
        address: Address, abi: InterfaceAbi
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
    public async connect(
        runner?: ContractRunner
    ): Promise<Contract> {
        if (!runner) {
            if (this._connected === undefined) {
                const provider = await MMProvider();
                const signer = await provider?.getSigner();
                this._connected = this.contract(signer);
            }
            return this._connected;
        }
        return this.contract(runner);
    }
    protected contract(
        runner?: ContractRunner
    ): Contract {
        let contract = this._contracts.get(runner);
        if (contract === undefined) {
            contract = new Contract(this.address, this.abi, runner);
            this._contracts.set(runner, contract);
        }
        return contract;
    }
    protected get abi() {
        return this._abi;
    }
    public get address(): Address {
        return this._address;
    }
    private _abi: InterfaceAbi;
    private _address: Address;
    private _connected: Contract | undefined;
    private _contracts: Map<ContractRunner | undefined, Contract> = new Map();
}
export default Base;
