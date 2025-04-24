import { Contract, ContractRunner, InterfaceAbi, Interface, isCallException, ErrorDescription } from 'ethers';
import { MMProvider } from '../blockchain';
import { Address } from '../redux/types';
import { RWParams } from '../params';
import { x40 } from '../functions';

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
                const signer = await this.signer()
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
    protected async signer(): Promise<ContractRunner | undefined> {
        const provider = await MMProvider();
        if (RWParams.account) {
            return provider?.getSigner(x40(RWParams.account));
        } else {
            return provider?.getSigner(); // default account
        }
    }
    public parse(e: unknown): ErrorDescription | unknown {
        if (isCallException(e) && e.data) {
            const iface = new Interface(this._abi);
            const error = iface.parseError(e.data);
            if (error) return error;
        }
        return e;
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
