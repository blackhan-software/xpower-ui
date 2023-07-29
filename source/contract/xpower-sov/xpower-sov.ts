import { InterfaceAbi } from 'ethers';
import { MYProvider } from '../../blockchain';
import { ROParams } from '../../params';
import { Address, Collat } from '../../redux/types';
import { Version, VersionAt } from '../../types';
import { Base } from '../base';

import ABI from './xpower-sov.abi.json';

export class XPowerSov extends Base {
    public constructor(
        address: Address, abi: InterfaceAbi = ABI
    ) {
        if (ROParams.lt(VersionAt(-1))) {
            abi = require(`./xpower-sov.abi.${ROParams.version}.json`);
        }
        super(address, abi);
    }
    public async collat(): Promise<Collat> {
        const contract = await this.get;
        if (ROParams.lt(Version.v7b)) {
            return 1_000_000n; // 100%
        }
        return contract.collateralization();
    }
    private get get() {
        return MYProvider().then((p) => this.connect(p));
    }
}
export default XPowerSov;
