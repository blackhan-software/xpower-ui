import { Contract, InterfaceAbi } from 'ethers';
import { Blockchain, MYProvider } from '../../blockchain';
import { testing, x40 } from '../../functions';
import { Account, Address } from '../../redux/types';
import { Base } from '../base';

import ABI from './avvy-domains.abi.json';

export class AvvyDomains extends Base {
    public constructor(
        address: Address = '0x1c7e15C29110E51D5f55d9Deb7200fbAC6665Fae',
        abi: InterfaceAbi = ABI
    ) {
        super(address, abi);
    }
    public async reverseResolveEVMToName(
        account: Account
    ): Promise<string> {
        if (await Blockchain.isMainnet() || testing()) {
            const contract = await this.get;
            return reverse(account, contract);
        }
        return '';
    }
    private get get() {
        return MYProvider().then((p) => this.connect(p));
    }
}
async function reverse(
    account: Account, contract: Contract
) {
    const address = x40(account);
    const name = get(address);
    if (name !== null) {
        return name;
    }
    set(address, await contract.reverseResolveEVMToName(
        address
    ));
    return get(address) ?? '';
}
function get(address: Address) {
    return localStorage.getItem('avvy:' + address);
}
function set(address: Address, name: string) {
    localStorage.setItem('avvy:' + address, name);
}
export default AvvyDomains;
