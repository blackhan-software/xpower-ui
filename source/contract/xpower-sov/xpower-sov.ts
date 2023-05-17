import { InterfaceAbi } from 'ethers';
import { MYProvider } from '../../blockchain';
import { ROParams } from '../../params';
import { Address, Collat } from '../../redux/types';
import { Version } from '../../types';
import { Base } from '../base';

import ABI from './xpower-sov.abi.json';

export class XPowerSov extends Base {
    public constructor(
        address: Address, abi: InterfaceAbi = ABI
    ) {
        super(address, abi);
    }
    public async collat(): Promise<Collat> {
        const contract = await this.get;
        if (ROParams.version < Version.v7b) {
            return 1_000_000n; // 100%
        }
        return contract.collateralization();
    }
    private get get() {
        return MYProvider().then((p) => this.connect(p));
    }
}
export default XPowerSov;
