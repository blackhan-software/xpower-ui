import { ContractInterface } from 'ethers';
import { Base } from '../base';

import ABI from './xpower-sov.abi.json';

export class XPowerSov extends Base {
    public constructor(
        address: string, abi: ContractInterface = ABI
    ) {
        super(address, abi);
    }
}
export default XPowerSov;
